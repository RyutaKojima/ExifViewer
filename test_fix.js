
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
    ISO: {
      type: 'prefix',
      label: 'ISO ',
    },
    Default: {
      type: 'none',
      label: 'none',
    }
  },
  FieldName: {}
};

const exifUtil = new ExifUtil(config.FieldName, config.valueFormat);

const tests = [
  { key: 'Orientation', value: 1, expected: 'そのまま' },
  { key: 'Orientation', value: 2, expected: 2 },
  { key: 'FocalLength', value: 50, expected: '50mm' },
  { key: 'ISO', value: 400, expected: 'ISO 400' },
  { key: 'Default', value: 'test', expected: 'test' },
  { key: 'Unknown', value: 100, expected: 100 },
];

let failed = false;
for (const { key, value, expected } of tests) {
  const result = exifUtil.getExifValueLabel(key, value);
  if (result !== expected) {
    console.error(`Test failed for ${key}: expected ${expected}, got ${result}`);
    failed = true;
  } else {
    console.log(`Test passed for ${key}: got ${result}`);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('All functional tests passed!');
}
