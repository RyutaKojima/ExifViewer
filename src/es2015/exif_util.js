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
    return (key in this.FieldName) ? this.FieldName[key] : key;
  }

  getExifValueLabel(key, value) {
    const format = this.ValueFormat[key];
    if (format === undefined) {
      return value;
    }

    let label = value;
    const formatType = format.type;
    const formatLabel = format.label;
    switch (formatType) {
      case 'replace': {
        const replaced = formatLabel[label];
        if (replaced !== undefined) {
          label = replaced;
        }
        break;
      }
      case 'prefix':
        label = formatLabel + label;
        break;
      case 'suffix':
        label += formatLabel;
        break;
      default: break;
    }

    return label;
  }
}
