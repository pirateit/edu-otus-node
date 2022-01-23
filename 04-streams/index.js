const fs = require('fs');
const Buffer = require('buffer').Buffer;
const readline = require('readline');
const randomNumber = require('./utils/randomNumber');
const mergeSort = require('./utils/mergeSort');
var Transform = require('stream').Transform;

const createFile = () => {
  const fileSize = 10; // File size in MB
  const writableStream = fs.createWriteStream('./numbers.txt');

  for (let i = 0; i < fileSize; i += 1) {
    process.stdout.write(`Creating file with random numbers. Please wait. Progress: ${i} of ${fileSize} MB...`)

    let resultBuffer = Buffer.alloc(0);

    while (Buffer.byteLength(resultBuffer) < 1048576) { // 1Mb
      resultBuffer = Buffer.concat([resultBuffer, Buffer.from(`${randomNumber()}\n`)]);
    }

    writableStream.write(resultBuffer.toString());

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  writableStream.end();
  process.stdout.write('File with random numbers created');
};

// createFile();

let filesCounter = 1;
const splitFile = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }

    const readableStream = fs.createReadStream('./_numbers.txt');
    // const rl = readline.createInterface({
    //   input: readableStream,
    //   crlfDelay: Infinity
    // });

    // let resultBuffer = Buffer.alloc(0);
    // let writableStream;
    let filesCounter = 1;
    // let arr = [];
    // rl.on('line', (input) => {
    //   if (Buffer.byteLength(resultBuffer) < 131072) { // 1 MB = 1048576
    //     resultBuffer = Buffer.concat([resultBuffer, Buffer.from(input + '\n')]);
    //   } else {
    //     writableStream = fs.createWriteStream(`./temp/${filesCounter}.txt`);
    //     resultBuffer.toString().split('\n').forEach(num => arr.push(num));
    //     arr = mergeSort(arr);
    //     writableStream.write(resultBuffer.toString());
    //     writableStream.end();
    //     resultBuffer = Buffer.alloc(0);
    //     resultBuffer = Buffer.concat([resultBuffer, Buffer.from(input + '\n')]);
    //     filesCounter += 1;
    //   }
    // })
    //   .on('close', () => {
    //     writableStream = fs.createWriteStream(`./temp/${filesCounter}.txt`);
    //     writableStream.write(resultBuffer.toString());
    //     writableStream.end();
    //     resultBuffer = Buffer.alloc(0);
    //     filesCounter += 1;
    //     resolve();
    //   });
    var liner = new Transform( { objectMode: true } );
    liner._transform = function (chunk, encoding, done) {
      var data = chunk.toString();
      if (this._lastLineData) data = this._lastLineData + data;

      var lines = data.split('\n');
      this._lastLineData = lines.splice(lines.length-1,1)[0];
      const arr = []
      // lines.forEach(arr.push(this));
      const writableStream = fs.createWriteStream(`./temp/${filesCounter}.txt`);
      writableStream.write(lines.join('\n'))
      filesCounter++
      console.log(lines)
      done();
 }

 // to flush remaining data (if any)
 liner._flush = function (done) {
      if (this._lastLineData) this.push(this._lastLineData);
      this._lastLineData = null;
      done();
 }
    readableStream.pipe(liner)

  })
};
// splitFile();

const joinFiles = () => {
  const writableStream = fs.createWriteStream('./sorted_numbers.txt');
  const streams = []
  const indexes = []
  for (let i = 1; i <= filesCounter; i += 1) {
    const stream = fs.createReadStream(`./temp/${i}.txt`)
    streams.push(stream)
  }

  // const rl = readline.createInterface({
  //   input: streams,
  //   crlfDelay: Infinity
  // });
  console.log(indexes)
};

// joinFiles();

(async () => {
  await splitFile()
  // joinFiles();
})()
