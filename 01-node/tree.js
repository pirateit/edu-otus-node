const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const argv = yargs.scriptName("node tree")
  .usage('$0 [options] | $0 <filepath> [options]')
  .option('d', {
    alias: 'depth',
    default: Infinity,
    describe: 'Depth of the tree',
    type: 'string'
  })
  .help()
  .version(false)
  .argv;

let finalTree = '';

if (argv._.length === 0) {
  const treeSample = {
    "name": 1,
    "items": [{
      "name": 2,
      "items": [{ "name": 3 }, { "name": 3, "items": [{ "name": 4 }, { "name": 4, "items": [{ "name": 5 }, { "name": 5, "items": [{ "name": 6 }] }] }] }, { "name": 3 }]
    }, {
      "name": 2,
      "items": [{ "name": 3 }]
    }, {
      "name": 2,
      "items": [{ "name": 3, "items": [{ "name": 4, "items": [{ "name": 5 }, { "name": 5 }] }] }]
    }]
  };

  treeBuild(treeSample);
  console.log(finalTree);
} else {
  if (fs.existsSync(argv._[0]) && fs.lstatSync(argv._[0]).isDirectory()) {
    const pathArg = path.parse(argv._[0]);
    const newTree = { name: pathArg.name, items: [] };
    let directoriesCount = 0;
    let filesCount = 0;
    let treeDepth = 0;
    newTree.items = getChilds(argv._[0])

    function getChilds(pathme) {
      if (treeDepth === Number(argv.depth) + 1) return;

      const parent = fs.readdirSync(pathme, { withFileTypes: true });
      const retruntree = [];

      for (const f of parent) {
        if (f.isDirectory()) {
          const newNode = { name: path.parse(pathme).name, items: [] };
          newNode.name = f.name;
          newNode.items = getChilds(path.join(path.parse(pathme).dir, path.parse(pathme).name, f.name), treeDepth += 1);
          retruntree.push(newNode);
          directoriesCount += 1;
        }
        if (f.isFile()) {
          const newNode = { name: path.parse(pathme).name };
          newNode.name = f.name;
          retruntree.push(newNode);
          filesCount += 1;
        }
      }

      return retruntree;
    }

    treeBuild(newTree);
    console.log(finalTree, '\n', directoriesCount, 'directories,', filesCount, 'files');
  } else {
    console.log('No such directory!\n');
    yargs.showHelp();
  }
}

function treeBuild(tree, depth = 0, parentLength = 0, isLast = false, isParentLast = false, parentsLastCounter = 0, pnlc = 0, dividers = []) {
  if (depth > Number(argv.depth) ) return;

  if (depth > 1) {
    const fdividers = [...dividers]
    for (let i = 0; i < fdividers.length; i += 1) {
      if (i % 2) {
        for (let j = 0; j < fdividers[i]; j += 1) {
          finalTree += '    ';
        }
      } else {
        if (i == 0) fdividers[i] -= 1;
        for (let j = 0; j < fdividers[i]; j += 1) {
          finalTree += '│   ';
        }
      }
    }
  }

  if (parentLength > 1 && !isLast) {
    finalTree += '├──';
  }
  if (isLast) finalTree += '└──';

  if (depth) finalTree += ' ';

  finalTree += tree['name'] + '\n';

  if (tree['items']) {
    dividers = [...dividers];

    if (isLast) {
      if (parentsLastCounter === 0) dividers.push(0);
      dividers[dividers.length - 1] += 1;
      parentsLastCounter += 1;
      pnlc = 0;
    } else {
      if (pnlc === 0) dividers.push(0);
      dividers[dividers.length - 1] += 1;
      pnlc += 1;
      parentsLastCounter = 0;
    }

    for (let i = 0; i < tree['items'].length; i += 1) {
      treeBuild(tree['items'][i], depth + 1, tree['items'].length, tree['items'].length === i + 1, isLast, parentsLastCounter, pnlc, dividers);
    }
  }
};
