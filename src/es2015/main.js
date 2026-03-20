import $ from 'jquery';
import EXIF from 'exif-js';
import viewerConfig from './config';
import ExifUtil from './exif_util';

/* global window, Image */
$(() => {
  const windowURL = window.URL || window.webkitURL;
  const exifUtil = new ExifUtil(viewerConfig.FieldName, viewerConfig.valueFormat);

  if (!window.FileReader) {
    window.alert('File API がサポートされていません。');
    return false;
  }

  const $overlay = $('.overlay');
  const $dropArea = $('.dropArea');
  const $exifInfo = $('.exifInfo');
  const $previewArea = $('.previewArea');

  const cancelEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const analyzeExif = (file, $infoBox, $imageBox) => {
    $infoBox.text('解析中...');
    $imageBox.empty();

    if (!file) {
      $infoBox.text('ファイルが読み込めませんでした。');
      return;
    }

    if (!ExifUtil.isSupport(file.type)) {
      $infoBox.text('サポートされていない形式です。');
      return;
    }

    EXIF.getData(file, () => {
      const exif = EXIF.getAllTags(file);
      const keys = Object.keys(exif);
      if (keys.length === 0) {
        $infoBox.text('Exif情報がありません。');
        return;
      }

      const table = document.createElement('table');
      keys.forEach((key) => {
        const tr = document.createElement('tr');
        const tdHeader = document.createElement('td');
        const tdValue = document.createElement('td');

        tdHeader.className = 'exifHeader';
        tdHeader.textContent = exifUtil.getFieldNameLabel(key);

        tdValue.className = 'exif_value';
        tdValue.textContent = exifUtil.getExifValueLabel(key, exif[key]);

        tr.appendChild(tdHeader);
        tr.appendChild(tdValue);
        table.appendChild(tr);
      });
      $infoBox.empty().append(table);
    });

    const img = new Image();
    const loadListener = (event) => {
      windowURL.revokeObjectURL(event.target.src);
      event.target.removeEventListener(event.type, loadListener);
    };
    img.alt = file.name;
    img.title = file.name;
    img.src = windowURL.createObjectURL(file);
    img.addEventListener('load', loadListener);
    $imageBox.append(img);
  };

  $('body')
    .on('dragenter', (event) => {
      $dropArea.addClass('dropping');
      $overlay.show();
      return cancelEvent(event);
    })
    .on('dragover', cancelEvent)
    .on('drop', (event) => {
      $exifInfo.empty();
      $previewArea.empty();

      $dropArea.removeClass('dropping');
      $overlay.hide();
      return cancelEvent(event);
    });

  $dropArea
    .on('drop', (event) => {
      // ファイルは複数ドロップされる可能性がありますが, 1 つ目のファイルだけ扱います.
      const file = event.originalEvent.dataTransfer.files[0];

      analyzeExif(file, $exifInfo, $previewArea);

      $dropArea.removeClass('dropping');
      $overlay.hide();
      return cancelEvent(event);
    });

  return true;
});
