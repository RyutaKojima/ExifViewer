const SUPPORT_FILE_TYPE = ['image/jpeg', 'image/tiff'];

export default class ExifUtil {
  constructor(configFieldName, configValueFormat) {
    this.FieldName = configFieldName;
    this.ValueFormat = configValueFormat;
  }

  static isSupport(mimeType) {
    return (SUPPORT_FILE_TYPE.indexOf(mimeType) !== -1);
  }

  getFieldNameLabel(key) {
    const hasProp = Object.prototype.hasOwnProperty.call(this.FieldName, key);
    return hasProp ? this.FieldName[key] : key;
  }

  getExifValueLabel(key, value) {
    const hasFormat = Object.prototype.hasOwnProperty.call(this.ValueFormat, key);
    if (!hasFormat) {
      return value;
    }
    const format = this.ValueFormat[key];

    const formatType = format.type;
    const formatLabel = format.label;

    // Fast-path early returns to avoid unnecessary variable re-assignments
    // and switch evaluation overhead
    if (formatType === 'replace') {
      const hasReplaced = Object.prototype.hasOwnProperty.call(formatLabel, value);
      return hasReplaced ? formatLabel[value] : value;
    }
    if (formatType === 'prefix') {
      return formatLabel + value;
    }
    if (formatType === 'suffix') {
      return value + formatLabel;
    }

    return value;
  }
}
