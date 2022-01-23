const mock = require('mock-fs');
const { buildTree, buildDirectoryTree } = require('./tree');

describe('Custom tree drawing', () => {
  it('Test correct custom tree drawing', () => {
    expect.assertions(1);
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
    const resultTree = `1
├── 2
│   ├── 3
│   ├── 3
│   │   ├── 4
│   │   └── 4
│   │       ├── 5
│   │       └── 5
│   │           └── 6
│   └── 3
├── 2
│   └── 3
└── 2
    └── 3
        └── 4
            ├── 5
            └── 5
`;
    return expect(buildTree(treeSample)).toBe(resultTree);
  });
});

describe('Directory tree drawing', () => {
  afterEach(() => {
    mock.restore();
  })

  it('Test correct directory tree drawing', () => {
    expect.assertions(1);
    mock({
      'dir': {
        'depth-1.txt': 'File content',
        'depth-1-dir1': {
          'depth-2-dir1': {
            'depth-3.txt': 'File content',
            'depth-3-dir1': {
              'depth-4-1.txt': 'File content',
              'depth-4-2.txt': 'File content',
            }
          },
          'depth-2-dir2': {},
          'depth-2.txt': 'File content',
        },
        'depth-1-dir2': {},
        'depth-1-dir3': {}
      }
    });
    const resultTree = {
      newTree: {
        name: 'dir',
        items: [{
          name: 'depth-1-dir1',
          items: [{
            name: 'depth-2-dir1',
            items: [{
              name: 'depth-3-dir1',
              items: [{
                name: 'depth-4-1.txt'
              }, {
                name: 'depth-4-2.txt'
              }]
            }, {
              name: 'depth-3.txt'
            }]
          }, { name: 'depth-2-dir2' }, { name: 'depth-2.txt' }]
        }, { name: 'depth-1-dir2', items: [] }, { name: 'depth-1-dir3', items: [] }, { name: 'depth-1.txt' }]
      },
      directoriesCount: 6,
      filesCount: 5
    }
    return expect(buildDirectoryTree('dir')).resolves.toMatchObject(resultTree);
  });
  it('Return error with directory tree drawing', () => {
    expect.assertions(1);
    return expect(buildDirectoryTree('unknown')).rejects.toEqual('\nNo such directory!\n');
  });
})
