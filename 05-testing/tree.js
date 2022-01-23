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

function buildTree(tree, depthArg) {
  let finalTree = '';

  function nodeTree(tree, depth = 0, parentLength = 0, isLast = false, isParentLast = false, parentsLastCounter = 0, pnlc = 0, dividers = []) {
    if (depth > Number(depthArg)) return;

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
        nodeTree(tree['items'][i], depth + 1, tree['items'].length, tree['items'].length === i + 1, isLast, parentsLastCounter, pnlc, dividers);
      }
    }
  };

  nodeTree(tree);

  return finalTree;
}

function buildDirectoryTree(dirPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
      const pathArg = path.parse(dirPath);
      const newTree = { name: pathArg.name, items: [] };
      let directoriesCount = 0;
      let filesCount = 0;
      let treeDepth = 1;
      newTree.items = getChilds(dirPath)

      function getChilds(pathme) {
        if (treeDepth === Number(argv.depth) + 1) return;

        const parent = fs.readdirSync(pathme, { withFileTypes: true });
        const childTree = [];

        for (const f of parent) {
          if (f.isDirectory()) {
            const newNode = { name: path.parse(pathme).name, items: [] };
            newNode.name = f.name;
            newNode.items = getChilds(path.join(path.parse(pathme).dir, path.parse(pathme).name, f.name), treeDepth += 1);
            childTree.push(newNode);
            directoriesCount += 1;
          }
          if (f.isFile()) {
            const newNode = { name: path.parse(pathme).name };
            newNode.name = f.name;
            childTree.push(newNode);
            filesCount += 1;
          }
        }

        return childTree;
      }

      resolve({ newTree, directoriesCount, filesCount });
    }

    const err = new Error('\nNo such directory!\n');
    reject(err.message)
  });
}

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

  console.log(buildTree(treeSample, argv.depth));
} else {
  buildDirectoryTree(argv._[0]).then(directoryTree => console.log(`${buildTree(directoryTree.newTree, argv.depth)}\n${directoryTree.directoriesCount} directories, ${directoryTree.filesCount} files`)).catch(err => {
    console.log(err);
    yargs.showHelp();
  });
}

module.exports = { buildTree, buildDirectoryTree };
