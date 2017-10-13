"use strict";

$(function () {
	let windowURL = window.URL || window.webkitURL;

	if( ! window.FileReader) {
		window.alert("File API がサポートされていません。");
		return false;
	}

	let cancelEvent = function(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	let fileAnalyze = function(file) {
		const SUPPORT_FILE_TYPE = ['image/jpeg', 'image/tiff'];

		$("#exifInfo").text("解析中...");
		$('#previewArea').empty();

		if ( ! file) {
			$("#exifInfo").text("ファイルが読み込めませんでした。");
			return;
		}

		if (SUPPORT_FILE_TYPE.indexOf(file.type) === -1) {
			$("#exifInfo").text("サポートされていない形式です。");
			return;
		}

		EXIF.getData(file, function(){
			let exif = EXIF.getAllTags(this);
			if (Object.keys(exif).length === 0) {
				$("#exifInfo").text("Exif情報がありません。");
				return;
			}

			let $table = $("<table>");
			for (let key in exif) {
				if ( ! exif.hasOwnProperty(key)) {
					continue;
				}

				// console.log(key + ": " + exif[key]);

				let label = labelConfig.hasOwnProperty(key) ? labelConfig[key] : key;

				let $tr = $("<tr>");
				$tr.append($("<td>").addClass("exifHeader").text(label));
				$tr.append($("<td>").addClass("exifValue").text(exif[key]));

				$table.append($tr);
			}
			$("#exifInfo").empty().append($table);
		});

		let img = new Image();
		img.alt = file.name;
		img.title = file.name;
		img.src = windowURL.createObjectURL(file);
		img.onload = function() {
			windowURL.revokeObjectURL(this.src);
			$('#previewArea').append(this);
		}
	};

	$("#dropArea")
		.bind("dragenter", cancelEvent)
		.bind("dragover", cancelEvent)
		.bind("drop", function(event) {
			// ファイルは複数ドロップされる可能性がありますが, 1 つ目のファイルだけ扱います.
			let file = event.originalEvent.dataTransfer.files[0];
	
			fileAnalyze(file);
	
			// デフォルトの処理をキャンセルします.
			return cancelEvent(event);
		});
});