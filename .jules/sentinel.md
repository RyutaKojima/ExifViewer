# Sentinel Security Journal

## 2025-05-20 - Safe Property Lookup to Guard Against Prototype Inheritance
**Vulnerability:** Directly looking up untrusted property keys on configuration objects (e.g., `this.FieldName[key]`) can access inherited methods/properties from `Object.prototype` (such as `toString`, `valueOf`, or `constructor`) if an EXIF metadata key matches a built-in property name.
**Learning:** Checking for property existence using direct indexed access (`obj[key] !== undefined`) is susceptible to prototype inheritance lookups.
**Prevention:** Use `Object.prototype.hasOwnProperty.call(obj, key)` to ensure property lookup checks only own properties on the object and ignores `Object.prototype`.

## 2025-05-21 - Type Checking Before Object Property Lookup with hasOwnProperty
**Vulnerability:** Invoking `Object.prototype.hasOwnProperty.call(obj, key)` with non-primitive key values (such as `Object.create(null)` or Symbol) causes an uncaught `TypeError: Cannot convert object to primitive value`, potentially leading to unhandled runtime exceptions during EXIF metadata evaluation.
**Learning:** `hasOwnProperty` attempts primitive coercion on `key` arguments, which fails fatally when passed null-prototype objects.
**Prevention:** Always validate that `key` or `value` is a primitive type (`string` or `number`) before passing it to property lookup mechanisms or `hasOwnProperty.call`.
