const fs = require('fs');
const Buffer = require('buffer').Buffer;
const Transform = require('stream').Transform;
const { once } = require('events');
const readline = require('readline');
const randomNumber = require('./utils/randomNumber');
const mergeSort = require('./utils/mergeSort');

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
  process.stdout.write('File with random numbers created.\n');
};

const splitFile = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }

    const readableStream = fs.createReadStream('./numbers.txt');
    const files = [];
    let filesCounter = 0;
    let linesCounter = 0;

    const liner = new Transform({ objectMode: true });
    liner._transform = function (chunk, encoding, done) {
      let data = chunk.toString();
      if (this._lastLineData) data = this._lastLineData + data;

      let lines = data.split('\n');
      this._lastLineData = lines.splice(lines.length - 1, 1)[0];
      lines = mergeSort(lines);
      linesCounter += lines.length;
      filesCounter++
      const writableStream = fs.createWriteStream(`./temp/${filesCounter}.txt`);
      writableStream.write(lines.join('\n') + '\n');
      files.push(`./temp/${filesCounter}.txt`)
      done();
    }

    liner._flush = function (done) {
      if (this._lastLineData) this.push(this._lastLineData);
      this._lastLineData = null;
      done();
    }

    readableStream.on('end', () => {
      process.stdout.write(`File splitted to ${filesCounter} parts.\n`);
      resolve({ files, linesCounter })
    });
    readableStream.pipe(liner);
  })
};

function streamAllFiles(files, min) {
  return new Promise(async (resolve, reject) => {
    let num = 0;
    let max = 99999;
    const streams = await files.map((file, index) => {
      const readableStream = fs.createReadStream(file);

      const rl = readline.createInterface({
        input: readableStream,
        terminal: false
      });

      rl.on('line', (line) => {
        if (line && +line > min && +line < max) {
          max = +line;
          num = +line
        }
      })

      rl.once('close', () => {
        resolve(num);
      });
    });
  })
}

const joinFiles = async (filesData) => {
  process.stdout.write(`Sorting started...`);

  let min = 0;

  for (let i = 1; i <= filesData.linesCounter; i += 1) {
    min = await streamAllFiles(filesData.files, min);
    fs.appendFileSync('./sorted_numbers.txt', `${min}\n`);
  }

  process.stdout.write(`Sorting ended to file sorted_numbers.txt.`);
}

(async () => {
  createFile();
  const files = await splitFile();
  joinFiles(files);
})()
