'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generator = exports.questions = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _scaffoldGenerator = require('scaffold-generator');

var _scaffoldGenerator2 = _interopRequireDefault(_scaffoldGenerator);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questions = exports.questions = [{
  type: 'input',
  name: 'name',
  message: 'package.json module name (eg orders, accounts-api, @namespace/payments)'
}, {
  type: 'input',
  name: 'description',
  message: 'package.json description of microservice'
}, {
  type: 'input',
  name: 'author',
  message: 'package.json author e.g Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)',
  default: function _default() {
    return '';
  }
}, {
  type: 'input',
  name: 'giturl',
  message: 'Git repository url e.g git@github.com:jabdul/crud-api.git#master',
  default: function _default() {
    return 'git@github.com';
  }
}, {
  type: 'input',
  name: 'organisation',
  message: function message() {
    return 'Project organisation';
  },
  default: function _default() {
    return 'CraftTurf Ltd';
  }
}, {
  type: 'input',
  name: 'directory',
  message: 'Root directory folder name (eg orders, accounts-api, payments)'
}, {
  type: 'input',
  name: 'mongodb',
  message: 'Name of MongoDb instance to connect to (eg orders, accounts-api, payments)'
}, {
  type: 'input',
  name: 'port',
  message: 'Preferred microservice port number',
  default: function _default() {
    return '4021';
  }
}, {
  type: 'input',
  name: 'destination',
  message: 'Microservice installation destination path',
  default: function _default() {
    return _path2.default.resolve(__dirname, '../', './src');
  }
}];

var generator = exports.generator = function generator(_ref) {
  var name = _ref.name,
      description = _ref.description,
      author = _ref.author,
      giturl = _ref.giturl,
      directory = _ref.directory,
      mongodb = _ref.mongodb,
      port = _ref.port,
      destination = _ref.destination,
      organisation = _ref.organisation;

  (0, _mkdirp2.default)(destination, function (err) {
    if (err) throw err;
  });

  var SCAFFOLD = _path2.default.resolve(__dirname, '../../', 'scaffold/service');
  var DEST_DIR = _path2.default.resolve(destination, directory);
  var copyrightYear = new Date().getFullYear();

  var dockerPath = /\b([a-z0-9-]*(?<=\/)[/a-z0-9-]+)\b/.test(name) ? /\b([a-z0-9-]*(?<=\/)[/a-z0-9-]+)\b/.exec(name)[0] : name;
  var serverName = (0, _capitalize2.default)(dockerPath);

  new _scaffoldGenerator2.default({
    data: (0, _extends3.default)({}, (0, _ramda.pickBy)(function (val, key) {
      return (0, _ramda.startsWith)('scaffold_', key);
    }, (0, _extends3.default)({}, _config2.default, {
      scaffold_project_name: name,
      scaffold_server_name: serverName,
      scaffold_docker_path: dockerPath,
      scaffold_project_description: description,
      scaffold_project_author: author,
      scaffold_project_git_url: giturl,
      scaffold_copyright_year: copyrightYear,
      scaffold_project_directory: directory,
      scaffold_project_organisation: organisation,
      scaffold_mongodb_name: mongodb,
      scaffold_service_port: port
    }))),
    ignore: _config2.default.FILES_IGNORE,
    render: _mustache2.default.render
  }).copy(SCAFFOLD, DEST_DIR).then(function () {
    console.log('done'); // eslint-disable-line no-console
  }).catch(function (e) {
    console.log(e); // eslint-disable-line no-console
  });
};