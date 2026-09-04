# Sentinel Security Journal

## 2025-05-20 - Safe Property Lookup to Guard Against Prototype Inheritance
**Vulnerability:** Directly looking up untrusted property keys on configuration objects (e.g., `this.FieldName[key]`) can access inherited methods/properties from `Object.prototype` (such as `toString`, `valueOf`, or `constructor`) if an EXIF metadata key matches a built-in property name.
**Learning:** Checking for property existence using direct indexed access (`obj[key] !== undefined`) is susceptible to prototype inheritance lookups.
**Prevention:** Use `Object.prototype.hasOwnProperty.call(obj, key)` to ensure property lookup checks only own properties on the object and ignores `Object.prototype`.

## 2025-09-04 - Defensive Drag and Drop Event Cancellation
**Vulnerability:** Accessing `event.originalEvent.dataTransfer.files[0]` before cancelling the drop event (`cancelEvent(event)`) or without optional chaining can cause uncaught `TypeError` exceptions if `dataTransfer` is undefined, allowing default browser file drop behavior (tab hijacking or opening untrusted local files) to occur.
**Learning:** In browser drag-and-drop handlers, any error during property extraction prevents `preventDefault()` from executing, causing the browser to navigate to the dropped file path or URL.
**Prevention:** Always invoke `preventDefault()` / `stopPropagation()` immediately at the start of the drop handler before extracting file properties, and guard `event.originalEvent` and `dataTransfer` with null checks.
