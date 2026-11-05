import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError, URLError

from scripts.fetch_goodreads import decode_widget, fetch_shelf, parse_widget, update_data

FIXTURES = Path(__file__).parent / "fixtures"
CURRENT = (FIXTURES / "currently-reading.txt").read_text(encoding="utf-8")
READ = (FIXTURES / "read.txt").read_text(encoding="utf-8")


class ParserTests(unittest.TestCase):
    def test_actual_widgets_preserve_order_unicode_entities_and_metadata(self):
        current = parse_widget(CURRENT, "currently-reading", 5)
        read = parse_widget(READ, "read", 10)
        self.assertEqual(len(current), 5)
        self.assertEqual(len(read), 10)
        self.assertEqual(current[0]["title"], "Meditações de Marco Aurélio")
        self.assertEqual(current[0]["author"], "Marcus Aurelius")
        self.assertEqual(current[-1]["author"], "Chris Carter")
        self.assertEqual(read[0]["title"], "Same as Ever: A Guide to What Never Changes")
        self.assertIn("Easy & Proven", read[3]["title"])
        self.assertEqual(current[0]["link"], "https://www.goodreads.com/review/show/8552612074")
        self.assertTrue(current[0]["cover"].startswith("https://i.gr-assets.com/"))

    def test_javascript_escapes_are_decoded_without_executing_script(self):
        self.assertEqual(decode_widget(r"var widget_code = 'Jo\u00e3o\n\x26 \'quote\' \/'; throw new Error('never execute');"), "João\n& 'quote' /")

    def test_login_page_wrong_shelf_and_truncated_response_are_rejected(self):
        for script, shelf in [("<html>Sign in</html>", "read"), (CURRENT, "read"), (CURRENT.split("<\\/noscript>")[0], "currently-reading")]:
            with self.subTest(shelf=shelf, script=script[:30]), self.assertRaises(ValueError):
                parse_widget(script, shelf, 10)

    def test_missing_metadata_duplicate_books_and_changed_template_are_rejected(self):
        for script in [
            CURRENT.replace("Marcus Aurelius", ""),
            CURRENT.replace("8403536726", "8552612074"),
            CURRENT.replace("gr_custom_each_container_", "changed_template_"),
            CURRENT.replace("www.goodreads.com/review/show/8552612074", "example.com/review/show/8552612074"),
        ]:
            with self.subTest(script=script[:30]), self.assertRaises(ValueError):
                parse_widget(script, "currently-reading", 5)

    def test_fewer_books_than_display_limit_are_valid(self):
        self.assertEqual(len(parse_widget(CURRENT, "currently-reading", 10)), 5)


class FetchTests(unittest.TestCase):
    def response(self, body=CURRENT, content_type="text/javascript; charset=utf-8"):
        response = MagicMock()
        response.__enter__.return_value = response
        response.headers = {"Content-Type": content_type}
        response.read.return_value = body.encode()
        return response

    @patch("scripts.fetch_goodreads.time.sleep")
    @patch("scripts.fetch_goodreads.urlopen")
    def test_transient_http_and_network_errors_are_retried(self, urlopen, sleep):
        urlopen.side_effect = [HTTPError("url", 503, "Unavailable", {}, None), URLError("timeout"), self.response()]
        self.assertEqual(len(fetch_shelf("currently-reading", 5)), 5)
        self.assertEqual(urlopen.call_count, 3)
        self.assertEqual(sleep.call_count, 2)
        url = urlopen.call_args.args[0]
        self.assertIn("widget_id=1923548901", url)
        self.assertIn("shelf=currently-reading", url)

    @patch("scripts.fetch_goodreads.time.sleep")
    @patch("scripts.fetch_goodreads.urlopen")
    def test_permanent_errors_and_login_redirect_are_not_retried(self, urlopen, sleep):
        urlopen.side_effect = HTTPError("url", 404, "Not Found", {}, None)
        with self.assertRaises(HTTPError):
            fetch_shelf("read", 10)
        self.assertEqual(urlopen.call_count, 1)
        sleep.assert_not_called()
        urlopen.side_effect = None
        urlopen.return_value = self.response("<html>Sign in</html>", "text/html")
        with self.assertRaises(ValueError):
            fetch_shelf("read", 10)

    @patch("scripts.fetch_goodreads.time.sleep")
    @patch("scripts.fetch_goodreads.urlopen", side_effect=URLError("offline"))
    def test_retry_count_is_bounded(self, urlopen, sleep):
        with self.assertRaises(URLError):
            fetch_shelf("read", 10)
        self.assertEqual(urlopen.call_count, 3)


class SnapshotTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.output = Path(self.directory.name) / "goodreads-data.json"
        self.current = parse_widget(CURRENT, "currently-reading", 5)
        self.read = parse_widget(READ, "read", 10)

    @patch("scripts.fetch_goodreads.fetch_shelf")
    def test_unchanged_books_do_not_rewrite_snapshot(self, fetch):
        fetch.side_effect = [self.current, self.read] * 2
        self.assertTrue(update_data(self.output))
        modified = self.output.stat().st_mtime_ns
        self.assertFalse(update_data(self.output))
        self.assertEqual(self.output.stat().st_mtime_ns, modified)
        self.assertEqual(json.loads(self.output.read_text())["readBooks"], self.read)

    @patch("scripts.fetch_goodreads.fetch_shelf")
    def test_second_shelf_failure_preserves_entire_previous_snapshot(self, fetch):
        self.output.write_text("previous valid snapshot")
        fetch.side_effect = [self.current, ValueError("invalid second shelf")]
        with self.assertRaises(ValueError):
            update_data(self.output)
        self.assertEqual(self.output.read_text(), "previous valid snapshot")
        self.assertEqual(list(self.output.parent.iterdir()), [self.output])

    @patch("scripts.fetch_goodreads.os.replace", side_effect=OSError("disk error"))
    @patch("scripts.fetch_goodreads.fetch_shelf")
    def test_failed_atomic_write_keeps_previous_file_and_removes_temporary(self, fetch, replace):
        self.output.write_text("previous valid snapshot")
        fetch.side_effect = [self.current, self.read]
        with self.assertRaises(OSError):
            update_data(self.output)
        self.assertEqual(self.output.read_text(), "previous valid snapshot")
        self.assertEqual(list(self.output.parent.iterdir()), [self.output])


if __name__ == "__main__":
    unittest.main()
