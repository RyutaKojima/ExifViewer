## 2026-03-31 - Fast-path HTML escaping for safe strings

**Learning:** Chained regular expression `.replace()` calls (e.g. 5 sequential replacements) create significant overhead (~7x slower) and unnecessary intermediate string allocations on strings that contain no HTML special characters. Testing strings with `/[&<>"']/` first provides a fast path for standard text (like EXIF tags and values).

**Action:** When escaping HTML strings in hot paths, check if special characters exist with a single regex `.test()` before performing replacements.
