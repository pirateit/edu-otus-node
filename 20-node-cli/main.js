#!/usr/bin/env node
const fs = require('fs');
const cmdShim = require('cmd-shim');
const vorpal = require('vorpal')();
const bcrypt = require('bcrypt');
var pjson = require('./package.json');
const demoData = require('./demo-data');

const args = process.argv.slice(2);
const AUTH_HELP = `
USAGE
  $ net-cli -u USER -p PASSWORD

OPTIONS
  -u, --user  provide your username
  -p, --pass  provide your password

EXAMPLES
  $ net-cli -u petrovich -p pass
`;

const writeToFile = (data, path) => {
  const writeStream = fs.createWriteStream(path);

  writeStream.write(data.toString());
};

vorpal.help(function (cmd) {
  return `
USAGE
  $ [command] [options]

COMMANDS
  list [city] [options]     print filtered list
  add <city> <address>      add IP addess to city
  remove <city> <address>   remove IP addess from city
  help, --help              help
  version, -v, --version    app version
  exit                      exit from console
  `;
});

vorpal
  .command('version')
  .description('Show version of application.')
  .alias('-v')
  .alias('--version')
  .action(function (args, callback) {
    this.log(pjson.version);
    callback();
  });

vorpal
  .command('list [city]')
  .option('-c, --cities', 'Print list of cities.')
  .option('-a, --addresses', 'Print list of all IP addresses.')
  .option('-e, --export <path>', 'Export filtered data to file.')
  .description('Outputs the list.')
  .help(function (args, callback) {
    this.log(`
USAGE
  $ list[city]

OPTIONS
  -c, --cities      print list of cities
  -a, --addresses   print list of all IP addresses
  -e, --export      export data to file

EXAMPLES
  $ list Moscow
  List of Moscow IP addresses
  ┌─────────┬───────────────────┐
  │ (index) │      Values       │
  ├─────────┼───────────────────┤
  │    0    │ '13.193.215.181'  │
  │    1    │  '89.64.137.36'   │
  │    2    │ '138.49.197.118'  │
  │    3    │ '210.240.214.196' │
  └─────────┴───────────────────┘

  # OR
  $ list - c
  List of Moscow IP addresses
  ┌─────────┬──────────┐
  │ (index) │  title   │
  ├─────────┼──────────┤
  │    0    │ 'London' │
  │    1    │ 'Moscow' │
  └─────────┴──────────┘
`);
    callback();
  })
  .action(function (args, callback) {
    if (args.city === 'h' || args.city === 'help') {
      this.log('If you want see help, just type: list --help');
    } else if (args.city) {
      const city = demoData.cities.find(city => city.title.toLowerCase() === args.city.toLowerCase());
      if (!city) {
        this.log(`There is no city found with title: ${args.city.charAt(0).toUpperCase() + args.city.slice(1)} `);
      } else if (city && args.options.export) {
        writeToFile(city.addresses, args.options.export);
        callback();
      } else {
        this.log(`List of ${city.title} IP addresses`);
        console.table(city.addresses);
      }
    } else if (args.options.addresses) {
      const addresses = demoData.cities.map(city => {
        return [...city.addresses];
      });
      if (args.options.export) {
        writeToFile([].concat.apply([], addresses), args.options.export);
        callback();
      } else {
        this.log(`List of all IP addresses`);
        console.table([].concat.apply([], addresses));
      }
    } else if (args.options.cities) {
      if (args.options.export) {
        writeToFile(demoData.cities, args.options.export);
        callback();
      } else {
        console.table(demoData.cities, ['title']);
      }
    } else {
      console.table(demoData.cities);
    }
    callback();
  });

vorpal
  .command('add <city> <address>')
  .description('Add IP addess to City.')
  .help(function (args, callback) {
    this.log(`
USAGE
  $ add < city > <single network address>

EXAMPLES
  $ add Moscow 195.211.160.76
  `);
    callback();
  })
  .action(function (args, callback) {
    const city = demoData.cities.find(city => city.title.toLowerCase() === args.city.toLowerCase());
    if (!city) {
      this.log(`There is no city found with title: ${args.city.charAt(0).toUpperCase() + args.city.slice(1)}`);
    } else {
      city.addresses.push(args.address);
      this.log('Success');
    }
    callback();
  });

vorpal
  .command('remove <city> <address>')
  .description('Remove IP addess from City.')
  .help(function (args, callback) {
    this.log(`
USAGE
  $ remove <city> <single network address>

EXAMPLES
  $ remove Moscow 195.211.160.76
    `);
    callback();
  })
  .action(function (args, callback) {
    const city = demoData.cities.find(city => city.title.toLowerCase() === args.city.toLowerCase());
    if (!city) {
      this.log(`There is no city found with title: ${args.city.charAt(0).toUpperCase() + args.city.slice(1)}`);
    } else {
      const index = city.addresses.indexOf(args.address);
      if (index > -1) {
        city.addresses.splice(index, 1);
      }
      this.log('Success');
    }
    callback();
  });

(async (args) => {
  let username = '';
  let password;

  if (args.length < 4) {
    process.stdout.write(AUTH_HELP);
    return;
  }

  args.map((flag, idx) => {
    switch (flag) {
      case '-u':
      case '--user':
        username = args[idx + 1];
        break;
      case '-p':
      case '--pass':
        password = args[idx + 1];
        break;
      case '-h':
      case '--help':
      case 'help':
        process.stdout.write(AUTH_HELP);
        break;
      case '-b':
      case '--build':
      case 'build':
        cmdShim(__dirname + '/main.js', './bin/net-cli').then(() => {
          // shims are created!
        })
        break;
    }
  });

  if (password) {
    password = bcrypt.compareSync(password, demoData.user.password);
  }

  if (args.length === 4 && username === demoData.user.username && password) {
    vorpal
      .delimiter('net-cli$')
      .show();
  } else if (args.length === 4) {
    process.stdout.write('Wrong username or password!');
  }
})(args);
