"use strict";

export default class ExifUtil
{
	constructor(configFieldName, configValueFormat) {
		this.FieldName   = configFieldName;
		this.ValueFormat = configValueFormat;
	}

	static isSupport(mimeType) {
		const SUPPORT_FILE_TYPE = ['image/jpeg', 'image/tiff'];
		return (SUPPORT_FILE_TYPE.indexOf(mimeType) !== -1);
	}

	getFieldNameLabel(key) {
		return this.FieldName.hasOwnProperty(key) ? this.FieldName[key] : key;
	}

	getExifValueLabel(key, value) {
		if ( ! this.ValueFormat.hasOwnProperty(key)) {
			return value;
		}

		let fomatType = this.ValueFormat[key].type;
		let fomatLabel = this.ValueFormat[key].label;
		switch (fomatType) {
			case "replace":
				if (fomatLabel.hasOwnProperty(value)) {
					value = fomatLabel[value];
				}
				break;
			case "prefix":
				value = fomatLabel + value;
				break;
			case "suffix":
				value += fomatLabel;
				break;
		}

		return value;
	}
}