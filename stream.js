const fs = require("fs");
const http = require("http");
const file = "./war-face.webm";


http.createServer((req, res) => {
	res.writeHeader(200, {"content-type": "video/webm"});
	fs.createReadStream(file) 
		.pipe(res)
		.on("error", console.error);
}).listen(3000, () => {
	return console.log(`STREAM: http://localhost:3000`);
});


