const SUPPORT_FILE_TYPE = ['image/jpeg', 'image/tiff'];

const isObject = (obj) => typeof obj === 'object' && obj !== null;

export default class ExifUtil {
  constructor(configFieldName, configValueFormat) {
    this.FieldName = configFieldName;
    this.ValueFormat = configValueFormat;
  }

  static isSupport(mimeType) {
    if (typeof mimeType !== 'string') {
      return false;
    }
    const normalizedType = mimeType.trim().toLowerCase().split(';')[0];
    return (SUPPORT_FILE_TYPE.indexOf(normalizedType) !== -1);
  }

  getFieldNameLabel(key) {
    if (key == null) {
      return key;
    }
    const hasProp = isObject(this.FieldName)
      && Object.prototype.hasOwnProperty.call(this.FieldName, key);
    return hasProp ? this.FieldName[key] : key;
  }

  getExifValueLabel(key, value) {
    if (key == null || value == null) {
      return value;
    }
    const hasFormat = isObject(this.ValueFormat)
      && Object.prototype.hasOwnProperty.call(this.ValueFormat, key);
    if (!hasFormat) {
      return value;
    }
    const format = this.ValueFormat[key];
    if (!isObject(format)) {
      return value;
    }

    const formatType = format.type;
    const formatLabel = format.label;

    // Fast-path early returns to avoid unnecessary variable re-assignments
    // and switch evaluation overhead
    if (formatType === 'replace') {
      const hasReplaced = isObject(formatLabel)
        && Object.prototype.hasOwnProperty.call(formatLabel, value);
      return hasReplaced ? formatLabel[value] : value;
    }
    if (formatType === 'prefix') {
      return (formatLabel != null ? formatLabel : '') + value;
    }
    if (formatType === 'suffix') {
      return value + (formatLabel != null ? formatLabel : '');
    }

    return value;
  }
}
