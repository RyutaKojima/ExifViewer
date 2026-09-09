# Sentinel Security Journal

## 2025-05-20 - Safe Property Lookup to Guard Against Prototype Inheritance
**Vulnerability:** Directly looking up untrusted property keys on configuration objects (e.g., `this.FieldName[key]`) can access inherited methods/properties from `Object.prototype` (such as `toString`, `valueOf`, or `constructor`) if an EXIF metadata key matches a built-in property name.
**Learning:** Checking for property existence using direct indexed access (`obj[key] !== undefined`) is susceptible to prototype inheritance lookups.
**Prevention:** Use `Object.prototype.hasOwnProperty.call(obj, key)` to ensure property lookup checks only own properties on the object and ignores `Object.prototype`.

## 2025-05-21 - Safe Event Cancellation and Property Guards in Drag-and-Drop Handlers
**Vulnerability:** ドロップイベントハンドラにおいて、プロパティ参照（`event.originalEvent.dataTransfer.files[0]`）の前に `cancelEvent(event)` を呼び出さない場合、`TypeError` 発生時にイベントキャンセルが呼び出されず、ブラウザのデフォルト挙動（ファイルのブラウザ遷移/タブ乗っ取り）が発生する。
**Learning:** イベントプロパティへのアクセスで例外が発生すると、ハンドラ末尾の `cancelEvent` / `preventDefault()` がスキップされる。
**Prevention:** ドロップイベントハンドラの先頭で即座に `cancelEvent(event)` を呼び出し、かつ `event.originalEvent.dataTransfer.files` への防御的プロパティガードを設ける。
