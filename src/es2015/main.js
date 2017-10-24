import viewerConfig from './config';
import ExifUtil from './exif_util';

/* global $, window, EXIF, Image */
$(() => {
  const windowURL = window.URL || window.webkitURL;
  const exifUtil = new ExifUtil(viewerConfig.FieldName, viewerConfig.valueFormat);

  if (!window.FileReader) {
    window.alert('File API がサポートされていません。');
    return false;
  }

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

    EXIF.getData(file, function () {
      const exif = EXIF.getAllTags(this);
      if (Object.keys(exif).length === 0) {
        $infoBox.text('Exif情報がありません。');
        return;
      }

      const $table = $('<table>');
      exif.keys().forEach((key) => {
        const $tr = $('<tr>');
        $tr.append($('<td>').addClass('exifHeader').text(exifUtil.getFieldNameLabel(key)));
        $tr.append($('<td>').addClass('exifValue').text(exifUtil.getExifValueLabel(key, exif[key])));
        $table.append($tr);
      });
      $infoBox.empty().append($table);
    });

    const img = new Image();
    img.alt = file.name;
    img.title = file.name;
    img.src = windowURL.createObjectURL(file);
    img.onload = function () {
      windowURL.revokeObjectURL(this.src);
      $imageBox.append(this);
    };
  };

  $('body')
    .bind('dragenter', (event) => {
      $('#dropArea').addClass('dropping');
      $('#overlay').show();
      return cancelEvent(event);
    })
    .bind('dragover', cancelEvent)
    .bind('drop', (event) => {
      $('#exifInfo').empty();
      $('#previewArea').empty();

      $('#dropArea').removeClass('dropping');
      $('#overlay').hide();
      return cancelEvent(event);
    });

  $('#dropArea')
    .bind('drop', (event) => {
      // ファイルは複数ドロップされる可能性がありますが, 1 つ目のファイルだけ扱います.
      const file = event.originalEvent.dataTransfer.files[0];

      analyzeExif(file, $('#exifInfo'), $('#previewArea'));

      $('#dropArea').removeClass('dropping');
      $('#overlay').hide();
      return cancelEvent(event);
    });

  return true;
});
