
import ExifUtil from './src/es2015/exif_util.js';

const config = {
  valueFormat: {
    Orientation: {
      type: 'replace',
      label: {
        1: 'そのまま',
      },
    },
    FocalLength: {
      type: 'suffix',
      label: 'mm',
    },
  },
  FieldName: {}
};

const exifUtil = new ExifUtil(config.FieldName, config.valueFormat);

const iterations = 10000000;
const start = performance.now();

for (let i = 0; i < iterations; i++) {
  exifUtil.getExifValueLabel('Orientation', 1);
  exifUtil.getExifValueLabel('FocalLength', 50);
  exifUtil.getExifValueLabel('Unknown', 100);
}

const end = performance.now();
console.log(`Time taken: ${(end - start).toFixed(4)}ms`);
