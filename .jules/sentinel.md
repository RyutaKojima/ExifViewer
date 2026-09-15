# Sentinel Security Journal

## 2025-05-20 - Safe Property Lookup to Guard Against Prototype Inheritance
**Vulnerability:** Directly looking up untrusted property keys on configuration objects (e.g., `this.FieldName[key]`) can access inherited methods/properties from `Object.prototype` (such as `toString`, `valueOf`, or `constructor`) if an EXIF metadata key matches a built-in property name.
**Learning:** Checking for property existence using direct indexed access (`obj[key] !== undefined`) is susceptible to prototype inheritance lookups.
**Prevention:** Use `Object.prototype.hasOwnProperty.call(obj, key)` to ensure property lookup checks only own properties on the object and ignores `Object.prototype`.

## 2025-05-21 - Defensive Drag-and-Drop Event Handling
**Vulnerability:** Invoking `event.originalEvent.dataTransfer.files[0]` prior to event cancellation (`cancelEvent(event)`) can throw an uncaught `TypeError` if the event object or `dataTransfer` is missing/malformed. When uncaught exceptions occur in `drop` handlers before `preventDefault()` runs, the browser executes its default action, causing window/tab hijacking and navigation to untrusted dropped content.
**Learning:** Unhandled exceptions in drag-and-drop event handlers disrupt event cancellation flow and expose the browser tab to navigation hijacking.
**Prevention:** Call `cancelEvent(event)` at the beginning of drag-and-drop event handlers and use defensive optional property checks (`event && event.originalEvent && ...`).
