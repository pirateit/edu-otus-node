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
  process.stdout.write('File with random numbers created');
};


let filesCounter = 1;
const splitFile = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }

    const readableStream = fs.createReadStream('./_numbers.txt');
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
      done();
    }

    liner._flush = function (done) {
      if (this._lastLineData) this.push(this._lastLineData);
      this._lastLineData = null;
      done();
    }

    readableStream.on('end', () => resolve({ filesCounter, linesCounter }));
    readableStream.pipe(liner);
  })
};

const joinFiles = async (files) => {
  console.log(files)

  const streams = [];
  for (let i = 1; i < files.filesCounter; i += 1) {
    const readable = fs.createReadStream(`./temp/${i}.txt`);

    // readable.on('end', () => {
    //   if (streams[i + 1]) {
    //     streams[i + 1].resume();
    //   }
    // });

    streams.push(readable);
  }

    let min = -1;
    // for (let i = 1; i < 5; i++) {
    let count = 0;
    let mid = 99999;
    (async function google(stream = streams[0]) {
      console.log(min)
      try {
        const rl = readline.createInterface({
          input: stream.resume(),
          crlfDelay: Infinity
        });

        rl.on('line', (line) => {
          if (Number(line) > min && Number(line) < mid) {
            mid = Number(line)
            min = mid;
          }
        });

        await once(rl, 'close');

        count += 1
      } catch (err) {
        console.error(err);
      }
      min = mid;
      return google(streams[count])
    })();
  // }

  // fs.appendFile('./sorted_numbers.txt', String(min), (err) => console.log(err))
}

(async () => {
  const files = await splitFile();
  joinFiles(files);
})()
