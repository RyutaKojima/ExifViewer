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
    const fieldName = this.FieldName[key];
    return (fieldName !== undefined) ? fieldName : key;
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
        const replacedLabel = formatLabel[label];
        if (replacedLabel !== undefined) {
          label = replacedLabel;
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
