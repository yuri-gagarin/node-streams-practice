const {PassThrough, Duplex} = require("stream");
const {createReadStream, createWriteStream} = require("fs");

const readStream = createReadStream("./war-face.webm");
const writeStream = createWriteStream("./war-face2.webm");


class Throttle extends Duplex {
	constructor(ms) {
		super();
		this.delay = ms;
	}

	_read() {

	}

	_write(chunk, encoding, callback) {
		this.push(chunk);
		setTimeout(callback, this.delay);
	}

	_final() {
		this.push(null);
	}
}

const report = new PassThrough();
const throttle = new Throttle(1000);

let total = 0;
report.on("data", (chunk) => {
	total += chunk.length;
	console.log(`bytes: ${total}`);
});


readStream
	.pipe(throttle)
	.pipe(report)
	.pipe(writeStream);