const fs = require("fs");
const path = require("path");
const {v4: uuidv4} = require("uuid");
const {fork} = require("child_process");
const createDirRecursively = require("../utils/recursiveDir");
const setFileExtension = require("../utils/setFileExtension");

class ImageController {
	async uploadImage(req, res, next) {
		try {
			const {folderName} = req.body;
			const image = req.files?.image;
			var tempFilePath = image?.tempFilePath;
			const fileName = setFileExtension(
				uuidv4() + req.files?.image?.name.replace(/\s/g, ""),
				".png",
			);
			const outputDir = path.resolve(
				__dirname,
				"../../../uploads/image/",
				folderName || "",
			);
			const outputPath = path.join(
				__dirname,
				"../../../uploads/image/",
				folderName || "",
				"./",
			);
			const url =
				req.protocol +
				"://" +
				req.get("host") +
				path.join("/image", folderName || "", fileName);

			if (!fs.existsSync(outputDir)) {
				createDirRecursively(outputDir);
			}
			console.log(
				path.join(
					__dirname,
					"../../../uploads/image/",
					folderName || "",
					fileName || "",
				),
			);
			image.mv(
				path.join(
					__dirname,
					"../../../uploads/image/",
					folderName || "",
					fileName || "",
				),
			);

			res.send(url);
		} catch (error) {
			if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
			next(error);
		}
	}
}

module.exports = ImageController;
