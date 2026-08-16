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
    const fieldNameLabel = this.FieldName[key];
    return (fieldNameLabel !== undefined) ? fieldNameLabel : key;
  }

  getExifValueLabel(key, value) {
    const format = this.ValueFormat[key];
    if (format === undefined) {
      return value;
    }

    const formatType = format.type;
    const formatLabel = format.label;

    // Fast-path early returns to avoid unnecessary variable re-assignments
    // and switch evaluation overhead
    if (formatType === 'replace') {
      const replacedLabel = formatLabel[value];
      return (replacedLabel !== undefined) ? replacedLabel : value;
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
