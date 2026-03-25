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
    if (!(key in this.ValueFormat)) {
      return value;
    }

    let label = value;
    const format = this.ValueFormat[key];
    const formatType = format.type;
    const formatLabel = format.label;
    switch (formatType) {
      case 'replace':
        if (label in formatLabel) {
          label = formatLabel[label.toString()];
        }
        break;
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
