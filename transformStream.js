const {Transform} = require("stream");

class ReplaceText extends Transform {

	constructor(char) {
		super();
		this.replaceChar = char;
	}

	_transform(chunk, encoding, callback) {
		const transformChunk = chunk.toString()
			.replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar);
		this.push(transformChunk);
		callback();
	}

	_flush(callback) {
		this.push("More stuff is being passed..." );
		callback();
	}
}


let xStream = new ReplaceText("x");



process.stdin
	.pipe(xStream)
	.pipe(process.stdout);