"""Fetch public Goodreads widgets without credentials or executing their JavaScript."""

import argparse
import json
import os
import re
import sys
import tempfile
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import urlopen

USER_ID = "19235489"
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "goodreads-data.json"


def decode_widget(script):
    match = re.search(r"\bvar widget_code\s*=\s*'((?:\\.|[^'\\])*)'", script)
    if not match:
        raise ValueError("Goodreads widget HTML is missing")
    escapes = {"n": "\n", "r": "\r", "t": "\t", "b": "\b", "f": "\f"}

    def decode(match):
        value = match.group(1)
        if value.startswith(("u", "x")):
            return chr(int(value[1:], 16))
        if value in escapes:
            return escapes[value]
        if value in "\\\"'/":
            return value
        raise ValueError(f"Unsupported widget escape: {value}")

    return re.sub(r"\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)", decode, match.group(1))


class WidgetParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.books = []
        self.book = None
        self.depth = 0
        self.book_depth = None
        self.field = None
        self.field_depth = None
        self.shelf = None
        self.complete = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get("class", "").split()
        if tag == "div":
            if self.depth:
                self.depth += 1
            elif any(c.startswith("gr_custom_container_") for c in classes):
                self.depth = 1
            if not self.depth:
                return
            if any(c.startswith("gr_custom_each_container_") for c in classes):
                if self.book is not None:
                    raise ValueError("Unexpected nested book container")
                self.book = {"cover": ""}
                self.book_depth = self.depth
            for field in ("title", "author"):
                if any(c.startswith(f"gr_custom_{field}_") for c in classes):
                    self.field = field
                    self.field_depth = self.depth

        if tag == "a" and self.depth:
            url = urlparse(attrs.get("href", ""))
            if re.fullmatch(rf"/review/list/{USER_ID}(?:-[^/]+)?", url.path):
                self.shelf = parse_qs(url.query).get("shelf", [None])[0]
            if self.book is not None and self.field == "title":
                self.book["link"] = attrs.get("href", "").split("?")[0]
        if tag == "img" and self.book is not None:
            self.book["cover"] = attrs.get("src", "")

    def handle_data(self, text):
        if self.book is not None and self.field:
            self.book[self.field] = self.book.get(self.field, "") + text

    def handle_endtag(self, tag):
        if tag != "div" or not self.depth:
            return
        if self.depth == self.field_depth:
            self.field = self.field_depth = None
        if self.depth == self.book_depth:
            self.books.append(self.book)
            self.book = self.book_depth = None
        self.depth -= 1
        if self.depth == 0:
            self.complete = True


def parse_widget(script, shelf, limit):
    parser = WidgetParser()
    parser.feed(decode_widget(script))
    parser.close()
    if not parser.complete or parser.book is not None or parser.shelf != shelf:
        raise ValueError(f"Incomplete widget or wrong shelf for {shelf}")
    # An empty or changed template must never silently erase the saved library.
    if not parser.books or len(parser.books) > limit:
        raise ValueError(f"Unexpected book count for {shelf}: {len(parser.books)}")

    ids = set()
    for book in parser.books:
        for field in ("title", "author"):
            book[field] = " ".join(book.get(field, "").split())
        book["author"] = re.sub(r"^by(?:\s+|$)", "", book["author"])
        link = urlparse(book.get("link", ""))
        review = re.fullmatch(r"/review/show/(\d+)", link.path)
        if not book["title"] or not book["author"] or not review or link.scheme != "https" or link.hostname != "www.goodreads.com":
            raise ValueError(f"Incomplete book in {shelf}")
        book["id"] = review.group(1)
        if book["id"] in ids:
            raise ValueError(f"Duplicate book in {shelf}")
        ids.add(book["id"])
        if book["cover"]:
            cover = urlparse(book["cover"])
            if cover.scheme != "https" or not (cover.hostname or "").endswith(".gr-assets.com"):
                raise ValueError(f"Unexpected cover URL in {shelf}")
    return parser.books


def fetch_shelf(shelf, limit):
    params = {
        "shelf": shelf, "num_books": limit,
        "sort": "date_read" if shelf == "read" else "date_added", "order": "d",
        "show_title": 1, "show_author": 1, "show_cover": 1,
        "show_rating": 0, "show_review": 0, "show_tags": 0, "cover_size": "medium",
        # Each shelf needs its own widget ID; reusing one can return the wrong shelf.
        "widget_id": "1923548901" if shelf == "currently-reading" else "1923548903",
    }
    url = f"https://www.goodreads.com/review/custom_widget/{USER_ID}?{urlencode(params)}"
    for attempt in range(3):
        try:
            with urlopen(url, timeout=20) as response:
                if "javascript" not in response.headers.get("Content-Type", ""):
                    raise ValueError(f"Unexpected response type for {shelf}")
                return parse_widget(response.read().decode("utf-8"), shelf, limit)
        except HTTPError as error:
            error.close()
            if error.code != 429 and error.code < 500:
                raise
            if attempt == 2:
                raise
        except (URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)


def update_data(output=OUTPUT):
    # Fetch and validate both shelves before touching the previous snapshot.
    data = {
        "currentlyReading": fetch_shelf("currently-reading", 5),
        "readBooks": fetch_shelf("read", 10),
    }
    content = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    output = Path(output)
    if output.exists() and output.read_text(encoding="utf-8") == content:
        print("Goodreads books unchanged")
        return False

    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent, delete=False) as file:
            temporary = Path(file.name)
            file.write(content)
        os.replace(temporary, output)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    print(f"Saved {len(data['currentlyReading'])} current and {len(data['readBooks'])} read books")
    return True


if __name__ == "__main__":
    arguments = argparse.ArgumentParser(description=__doc__)
    arguments.add_argument("--output", type=Path, default=OUTPUT)
    try:
        update_data(arguments.parse_args().output)
    except (OSError, ValueError) as error:
        print(f"Goodreads update failed; previous data preserved: {error}", file=sys.stderr)
        sys.exit(1)
