import $ from 'jquery';
import EXIF from 'exif-js';
import viewerConfig from './config';
import ExifUtil from './exif_util';

/* global window, document, Image */

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

    try {
      // EXIF.getData 自体の同期的な呼び出しエラーをキャッチ
      EXIF.getData(file, () => {
        try {
          // 非同期コールバック内で EXIF タグ解析時の例外をキャッチ
          const exif = EXIF.getAllTags(file);
          if (!exif) {
            $infoBox.text('Exif情報がありません。');
            return;
          }
          const keys = Object.keys(exif);
          if (keys.length === 0) {
            $infoBox.text('Exif情報がありません。');
            return;
          }

          const table = document.createElement('table');
          keys.forEach((key) => {
            const tr = document.createElement('tr');

            const tdHeader = document.createElement('td');
            tdHeader.className = 'exifHeader';
            tdHeader.textContent = exifUtil.getFieldNameLabel(key);

            const tdValue = document.createElement('td');
            tdValue.className = 'exif_value';
            tdValue.textContent = exifUtil.getExifValueLabel(key, exif[key]);

            tr.appendChild(tdHeader);
            tr.appendChild(tdValue);
            table.appendChild(tr);
          });
          $infoBox.empty().append(table);
        } catch (error) {
          $infoBox.text('Exif情報の解析に失敗しました。');
        }
      });
    } catch (error) {
      $infoBox.text('Exif情報の解析に失敗しました。');
    }

    try {
      const img = new Image();
      const cleanup = (event) => {
        if (windowURL && typeof windowURL.revokeObjectURL === 'function') {
          windowURL.revokeObjectURL(event.target.src);
        }
        event.target.removeEventListener('load', cleanup);
        event.target.removeEventListener('error', cleanup);
      };
      const safeName = ExifUtil.sanitizeFileName(file ? file.name : '');
      img.alt = safeName;
      img.title = safeName;
      img.src = windowURL.createObjectURL(file);
      img.addEventListener('load', cleanup);
      img.addEventListener('error', cleanup);
      $imageBox.append(img);
    } catch (error) {
      // オブジェクトURL生成時などのエラーをキャッチし、不完全な状態を防ぐ
      $imageBox.text('プレビュー画像の生成に失敗しました。');
    }
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
