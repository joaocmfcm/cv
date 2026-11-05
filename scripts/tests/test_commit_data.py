"""Exercise data commits against isolated local Git repositories, never GitHub."""

import os
import subprocess
import tempfile
import unittest
from pathlib import Path

HELPER = Path(__file__).resolve().parents[1] / "commit-data.sh"


class CommitDataTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.remote = self.root / "remote.git"
        self.checkout = self.root / "checkout"
        self.git(self.root, "init", "--bare", "--initial-branch=main", str(self.remote))
        self.git(self.root, "clone", str(self.remote), str(self.checkout))
        self.git(self.checkout, "config", "user.name", "Test")
        self.git(self.checkout, "config", "user.email", "test@example.com")
        (self.checkout / "data.json").write_text("old")
        self.git(self.checkout, "add", "data.json")
        self.git(self.checkout, "commit", "-m", "Initial data")
        self.git(self.checkout, "push", "origin", "main")
        self.environment = {**os.environ, "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull}

    def git(self, directory, *args):
        result = subprocess.run(["git", *args], cwd=directory, capture_output=True, text=True,
                                env={**os.environ, "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull})
        if result.returncode:
            self.fail(result.stderr)
        return result.stdout.strip()

    def run_helper(self):
        return subprocess.run(["bash", str(HELPER), "data.json", "chore: update data"],
                              cwd=self.checkout, env=self.environment, capture_output=True, text=True)

    def test_no_change_makes_no_commit(self):
        before = self.git(self.checkout, "rev-parse", "HEAD")
        result = self.run_helper()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.git(self.checkout, "rev-parse", "HEAD"), before)
        self.assertIn("No data changes", result.stdout)

    def test_concurrent_change_to_another_file_is_preserved(self):
        other = self.root / "other"
        self.git(self.root, "clone", str(self.remote), str(other))
        self.git(other, "config", "user.name", "Test")
        self.git(other, "config", "user.email", "test@example.com")
        (other / "another.json").write_text("concurrent change")
        self.git(other, "add", "another.json")
        self.git(other, "commit", "-m", "Concurrent update")
        self.git(other, "push", "origin", "main")
        (self.checkout / "data.json").write_text("updated")
        result = self.run_helper()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.git(self.remote, "show", "main:data.json"), "updated")
        self.assertEqual(self.git(self.remote, "show", "main:another.json"), "concurrent change")

    def test_transient_push_rejection_is_retried(self):
        hook = self.remote / "hooks" / "pre-receive"
        hook.write_text('#!/bin/sh\nif [ ! -f rejected-once ]; then\n  touch rejected-once\n  exit 1\nfi\n')
        hook.chmod(0o755)
        # Skip backoff in this isolated test; use real Git for both pushes.
        binary = self.root / "bin"
        binary.mkdir()
        (binary / "sleep").write_text("#!/bin/sh\nexit 0\n")
        (binary / "sleep").chmod(0o755)
        self.environment["PATH"] = str(binary) + os.pathsep + os.environ["PATH"]
        (self.checkout / "data.json").write_text("updated")
        result = self.run_helper()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue((self.remote / "rejected-once").exists())
        self.assertEqual(self.git(self.remote, "show", "main:data.json"), "updated")


if __name__ == "__main__":
    unittest.main()
