import test from 'node:test';
import assert from 'node:assert/strict';
import ExifUtil from '../src/es2015/exif_util.js';

test('ExifUtil.sanitizeFileName should sanitize file names containing control characters and handle non-strings', () => {
  assert.equal(ExifUtil.sanitizeFileName('normal_photo.jpg'), 'normal_photo.jpg');
  assert.equal(ExifUtil.sanitizeFileName('photo\u0000\u001F.jpg'), 'photo.jpg');
  assert.equal(ExifUtil.sanitizeFileName('test\r\nname.jpg'), 'testname.jpg');
  assert.equal(ExifUtil.sanitizeFileName('bad\u007Ffile.jpg'), 'badfile.jpg');
  assert.equal(ExifUtil.sanitizeFileName('c1_\u0080_\u009F_control.jpg'), 'c1___control.jpg');
  assert.equal(ExifUtil.sanitizeFileName(null), '');
  assert.equal(ExifUtil.sanitizeFileName(undefined), '');
  assert.equal(ExifUtil.sanitizeFileName(12345), '');
});

test('ExifUtil.isSupport should identify supported MIME types correctly', () => {
  assert.equal(ExifUtil.isSupport('image/jpeg'), true);
  assert.equal(ExifUtil.isSupport('IMAGE/JPEG'), true);
  assert.equal(ExifUtil.isSupport(' image/jpeg '), true);
  assert.equal(ExifUtil.isSupport('image/jpeg; charset=utf-8'), true);
  assert.equal(ExifUtil.isSupport('image/tiff'), true);
  assert.equal(ExifUtil.isSupport('Image/TIFF'), true);
  assert.equal(ExifUtil.isSupport('image/png'), false);
  assert.equal(ExifUtil.isSupport('application/json'), false);
  assert.equal(ExifUtil.isSupport(null), false);
  assert.equal(ExifUtil.isSupport(undefined), false);
  assert.equal(ExifUtil.isSupport(123), false);
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

test('ExifUtil should safely handle primitive or invalid non-object configs without property leakage', () => {
  const primitiveUtil = new ExifUtil('primitive_string', 'primitive_string');
  assert.equal(primitiveUtil.getFieldNameLabel('length'), 'length');
  assert.equal(primitiveUtil.getExifValueLabel('length', 100), 100);

  const invalidReplaceUtil = new ExifUtil({}, {
    InvalidReplace: { type: 'replace', label: 'string_label' },
  });
  assert.equal(invalidReplaceUtil.getExifValueLabel('InvalidReplace', 'length'), 'length');
});

test('ExifUtil should safely handle array objects without property leakage (e.g. length)', () => {
  const arrayConfigUtil = new ExifUtil(['item1', 'item2'], ['item1', 'item2']);
  assert.equal(arrayConfigUtil.getFieldNameLabel('length'), 'length');
  assert.equal(arrayConfigUtil.getExifValueLabel('length', 'val'), 'val');

  const arrayLabelUtil = new ExifUtil({}, {
    ArrayReplace: { type: 'replace', label: ['option0', 'option1'] },
  });
  assert.equal(arrayLabelUtil.getExifValueLabel('ArrayReplace', 'length'), 'length');
});

test('ExifUtil should return null and undefined keys/values as-is without formatting coercion', () => {
  const valueFormatConfig = {
    FocalLength: { type: 'suffix', label: 'mm' },
    ISO: { type: 'prefix', label: 'ISO ' },
    Orientation: { type: 'replace', label: { null: 'invalid', undefined: 'invalid' } },
  };
  const exifUtil = new ExifUtil({ null: 'NullLabel' }, valueFormatConfig);

  assert.equal(exifUtil.getFieldNameLabel(null), null);
  assert.equal(exifUtil.getFieldNameLabel(undefined), undefined);

  assert.equal(exifUtil.getExifValueLabel('FocalLength', null), null);
  assert.equal(exifUtil.getExifValueLabel('FocalLength', undefined), undefined);
  assert.equal(exifUtil.getExifValueLabel('ISO', null), null);
  assert.equal(exifUtil.getExifValueLabel('ISO', undefined), undefined);
  assert.equal(exifUtil.getExifValueLabel('Orientation', null), null);
  assert.equal(exifUtil.getExifValueLabel('Orientation', undefined), undefined);
});
