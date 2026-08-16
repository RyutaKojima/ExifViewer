# Sentinel Security Journal

## 2025-05-20 - Safe Property Lookup to Guard Against Prototype Inheritance
**Vulnerability:** Directly looking up untrusted property keys on configuration objects (e.g., `this.FieldName[key]`) can access inherited methods/properties from `Object.prototype` (such as `toString`, `valueOf`, or `constructor`) if an EXIF metadata key matches a built-in property name.
**Learning:** Checking for property existence using direct indexed access (`obj[key] !== undefined`) is susceptible to prototype inheritance lookups.
**Prevention:** Use `Object.prototype.hasOwnProperty.call(obj, key)` to ensure property lookup checks only own properties on the object and ignores `Object.prototype`.
