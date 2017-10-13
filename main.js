"use strict";

$(function () {
	let windowURL = window.URL || window.webkitURL;

	// File API が使用できない場合は諦めます.
	if( ! window.FileReader) {
		window.alert("File API がサポートされていません。");
		return false;
	}

	// イベントをキャンセルするハンドラです.
	let cancelEvent = function(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	let fileAnalyze = function(file) {
		$("#exifInfo").text("解析中...");
		$('#previewArea').empty();

		if ( ! file) {
			$("#exifInfo").text("ファイルが読み込めませんでした。");
			return;
		}

		if (file.type !== 'image/jpeg') {
			$("#exifInfo").text("サポートされていない形式です。");
			return;
		}

		let img = new Image();
		img.alt = file.name;
		img.title = file.name;
		img.src = windowURL.createObjectURL(file);
		img.onload = function() {
			EXIF.getData(this, function(){
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

					let $tr = $("<tr>");
					$tr.append($("<td>").text(key));
					$tr.append($("<td>").text(exif[key]));

					$table.append($tr);
				}

				$("#exifInfo").empty().append($table);
			});

			windowURL.revokeObjectURL(this.src);
		};

		$('#previewArea').empty().append(img);
	};

	$("#dropArea")
		.bind("dragenter", cancelEvent)
		.bind("dragover", cancelEvent)
		.bind("drop", function(event) {
			// ファイルは複数ドロップされる可能性がありますが, ここでは 1 つ目のファイルを扱います.
			let file = event.originalEvent.dataTransfer.files[0];
	
			fileAnalyze(file);
	
			// デフォルトの処理をキャンセルします.
			return cancelEvent(event);
		});

	// $('#selectFile').on("change", function(){
	// 	if(this.files.length) {
	// 		fileAnalyze(this.files[0]);
	// 	}
	// });
});