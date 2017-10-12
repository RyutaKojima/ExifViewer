$(function () {
	var windowURL = window.URL || window.webkitURL;

	$('#imageFile').on("change", function(){
		if(this.files.length == 0) {
			return;
		}

		let selectFile = this.files[0];
		if (selectFile) {
			console.log(selectFile);
			// window.alert("file: " + selectFile.name);

			if (selectFile.type !== 'image/jpeg' && selectFile.type !== 'image/png') {
				window.alert('サポートされていない形式です。');
				return;
			}

			var img = new Image();
			img.src = windowURL.createObjectURL(selectFile);
			img.onload = function() {
				EXIF.getData(this, function(){
					var exif = EXIF.getAllTags(this);
					for (let key in exif) {
						if (exif.hasOwnProperty(key)) {
							// console.log(key + ": " + exif[key]);

							$tr = $("<tr>");
							$tr.append($("<td>").text(key));
							$tr.append($("<td>").text(exif[key]));

							$("#exifInfo").append($tr);
						}
					}
				});

				windowURL.revokeObjectURL(this.src);
			};
		}
	});
});