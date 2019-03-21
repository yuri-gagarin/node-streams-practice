const fs = require("fs");
const http = require("http");
const file = "./war-face.webm";

http.createServer((req, res) => {
	fs.readFile(file, (error, data) => {
		if (error) {
			console.log(`Error: ${error}`);
		}
		res.writeHead(200, {"content-type": "video/webm"});
		res.end(data);
	});

}).listen(3000, () => {
	return console.log("buffer -- http://localhost:3000");
});

