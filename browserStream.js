const {createServer} = require("http");
const {stat, createReadStream, createWriteStream} = require("fs");
const {promisify} = require("util");
const multiparty = require("multiparty");

const file = "./sample-hd.mp4";
const PORT = process.env.PORT || 3000;
const fileInfo = promisify(stat);


const respondWithVideo = async (req, res) => {

	const { size } = await fileInfo(file);

	const range = req.headers.range;

	if (range) {
		console.log(range);
		let [start, end] = range.replace(/bytes=/, "").split("-");
		start = parseInt(start, 10);
		end = end ? parseInt(end, 10) : size - 1;
		res.writeHead(206, {
			"Content-Range": `bytes ${start} - ${end} / ${size}`,
			"Accept-Ranges": "bytes", 
			"Content-Length": (end - start) + 1,
			"Content-Type": "video/mp4"
		});
		createReadStream(file, { start, end })
			.pipe(res);

	}
	else {
		res.writeHead(200, {
		"Content-Type": "video/mp4",
		"Content-Length": size
		});
		createReadStream(file)
			.pipe(res);
	}
	
}

createServer((req, res) => {
	if (req.url === "/video") {
		respondWithVideo(req, res);
	}
	else if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(`
			<form enctype="multipart/form-data" method="POST" action="/">
				<input type="file" name="upload-file"/>
				<button>Upload File</button>
			</form>
		`);
	}
	else if (req.url ==="/" && req.method == "POST") {
		let form = new multiparty.Form();
		form.on("part",(part) => {
			part.pipe(createWriteStream(`./uploads/${part.filename}`))
				.on("close", () => {
					res.writeHead(200);
					res.end(`<h1>File Uploaded</h1>
										<p>filename: ${part.filename}</p>`
								 );
				});
		});
		form.parse(req);

	}

}).listen(3000, () => {
	console.log(`Server running: ${PORT}`);
});