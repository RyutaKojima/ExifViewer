export default class ExifUtil {
  constructor(configFieldName, configValueFormat) {
    this.FieldName = configFieldName;
    this.ValueFormat = configValueFormat;
  }

  static isSupport(mimeType) {
    const SUPPORT_FILE_TYPE = ['image/jpeg', 'image/tiff'];
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
    const fomatType = this.ValueFormat[key].type;
    const fomatLabel = this.ValueFormat[key].label;
    switch (fomatType) {
      case 'replace':
        if (label in fomatLabel) {
          label = fomatLabel[label.toString()];
        }
        break;
      case 'prefix':
        label = fomatLabel + label;
        break;
      case 'suffix':
        label += fomatLabel;
        break;
      default: break;
    }

    return label;
  }
}
