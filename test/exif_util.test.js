import test from 'node:test';
import assert from 'node:assert/strict';
import ExifUtil from '../src/es2015/exif_util.js';

test('ExifUtil.isSupport should identify supported MIME types correctly', () => {
  assert.equal(ExifUtil.isSupport('image/jpeg'), true);
  assert.equal(ExifUtil.isSupport('image/tiff'), true);
  assert.equal(ExifUtil.isSupport('image/png'), false);
  assert.equal(ExifUtil.isSupport('application/json'), false);
});

test('ExifUtil.getFieldNameLabel should return custom label or default key', () => {
  const fieldNameConfig = {
    Make: 'メーカー',
    Model: 'モデル',
  };
  const exifUtil = new ExifUtil(fieldNameConfig, {});

  assert.equal(exifUtil.getFieldNameLabel('Make'), 'メーカー');
  assert.equal(exifUtil.getFieldNameLabel('Model'), 'モデル');
  assert.equal(exifUtil.getFieldNameLabel('UnknownField'), 'UnknownField');
});

test('ExifUtil.getExifValueLabel should format values according to valueFormat config', () => {
  const valueFormatConfig = {
    Orientation: {
      type: 'replace',
      label: {
        1: 'そのまま',
        6: '90°回転',
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
    },
  };
  const exifUtil = new ExifUtil({}, valueFormatConfig);

  // replace
  assert.equal(exifUtil.getExifValueLabel('Orientation', 1), 'そのまま');
  assert.equal(exifUtil.getExifValueLabel('Orientation', 6), '90°回転');
  assert.equal(exifUtil.getExifValueLabel('Orientation', 99), 99);

  // suffix
  assert.equal(exifUtil.getExifValueLabel('FocalLength', 50), '50mm');

  // prefix
  assert.equal(exifUtil.getExifValueLabel('ISO', 400), 'ISO 400');

  // fallback/none
  assert.equal(exifUtil.getExifValueLabel('Default', 'test'), 'test');
  assert.equal(exifUtil.getExifValueLabel('UnconfiguredKey', 123), 123);
});

test('ExifUtil should handle null or undefined configs gracefully', () => {
  const emptyUtil = new ExifUtil(null, null);
  assert.equal(emptyUtil.getFieldNameLabel('Make'), 'Make');
  assert.equal(emptyUtil.getExifValueLabel('Orientation', 1), 1);

  const missingLabelUtil = new ExifUtil({}, {
    MissingLabelReplace: { type: 'replace', label: null },
    MissingLabelPrefix: { type: 'prefix', label: null },
    MissingLabelSuffix: { type: 'suffix', label: null },
  });

  assert.equal(missingLabelUtil.getExifValueLabel('MissingLabelReplace', 123), 123);
  assert.equal(missingLabelUtil.getExifValueLabel('MissingLabelPrefix', 123), '123');
  assert.equal(missingLabelUtil.getExifValueLabel('MissingLabelSuffix', 123), '123');
});
