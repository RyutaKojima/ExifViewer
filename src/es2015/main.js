import viewerConfig from './config';
import ExifUtil from './exif_util';

$(function ($) {
	const windowURL = window.URL || window.webkitURL;
	const exifUtil = new ExifUtil(viewerConfig.FieldName, viewerConfig.valueFormat);

	if( ! window.FileReader) {
		window.alert("File API がサポートされていません。");
		return false;
	}

	let cancelEvent = (event) => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	let analyzeExif = (file, $infoBox, $imageBox) => {
		$infoBox.text("解析中...");
		$imageBox.empty();

		if ( ! file) {
			$infoBox.text("ファイルが読み込めませんでした。");
			return;
		}

		if ( ! ExifUtil.isSupport(file.type)) {
			$infoBox.text("サポートされていない形式です。");
			return;
		}

		EXIF.getData(file, function(){
			let exif = EXIF.getAllTags(this);
			if (Object.keys(exif).length === 0) {
				$infoBox.text("Exif情報がありません。");
				return;
			}

			let $table = $("<table>");
			for (let key in exif) {
				if ( ! exif.hasOwnProperty(key)) {
					continue;
				}

				let $tr = $("<tr>");
				$tr.append($("<td>").addClass("exifHeader").text(exifUtil.getFieldNameLabel(key)));
				$tr.append($("<td>").addClass("exifValue" ).text(exifUtil.getExifValueLabel(key, exif[key])));
				$table.append($tr);
			}
			$infoBox.empty().append($table);
		});

		let img = new Image();
		img.alt = file.name;
		img.title = file.name;
		img.src = windowURL.createObjectURL(file);
		img.onload = function() {
			windowURL.revokeObjectURL(this.src);
			$imageBox.append(this);
		}
	};

	$("body")
		.bind("dragenter", function(event) {
			$("#dropArea").addClass("dropping");
			$("#overlay").show();
			return cancelEvent(event);
		})
		.bind("dragover", cancelEvent)
		.bind("drop", function(event) {
			$("#exifInfo").empty();
			$('#previewArea').empty();

			$("#dropArea").removeClass("dropping");
			$("#overlay").hide();
			return cancelEvent(event);
		});

	$("#dropArea")
		.bind("drop", function(event) {
			// ファイルは複数ドロップされる可能性がありますが, 1 つ目のファイルだけ扱います.
			let file = event.originalEvent.dataTransfer.files[0];

			analyzeExif(file, $("#exifInfo"), $('#previewArea'));

			$("#dropArea").removeClass("dropping");
			$("#overlay").hide();
			return cancelEvent(event);
		});
});