'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generator = exports.questions = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _scaffoldGenerator = require('scaffold-generator');

var _scaffoldGenerator2 = _interopRequireDefault(_scaffoldGenerator);

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _path = require('path');

var _ramda = require('ramda');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questions = exports.questions = [{
  type: 'input',
  name: 'endpoint',
  message: 'Endpoint name (eg order, account, payment)'
}, {
  type: 'input',
  name: 'title',
  message: 'Endpoint title (eg Order, Account, Payment)',
  default: function _default(answers) {
    return (0, _capitalize2.default)(answers.endpoint);
  }
}, {
  type: 'input',
  name: 'endpoints',
  message: function message() {
    return 'Endpoint pluralisation (eg orders, accounts, payments)';
  },
  default: function _default(answers) {
    return answers.endpoint + 's';
  }
}, {
  type: 'input',
  name: 'destination',
  message: 'Endpopint installation destination',
  default: function _default() {
    return (0, _path.resolve)(__dirname, '../', './src');
  }
}];

var generator = exports.generator = function generator(_ref) {
  var endpoint = _ref.endpoint,
      endpoints = _ref.endpoints,
      title = _ref.title,
      destination = _ref.destination;

  (0, _mkdirp2.default)(destination, function (err) {
    if (err) throw err;
  });

  var SCAFFOLD = (0, _path.resolve)(__dirname, '../../', 'scaffold/endpoint');
  var TEST = (0, _path.resolve)(__dirname, '../../', 'scaffold/test');
  var DEST_DIR = destination;
  var TEST_PATH = (0, _path.resolve)(DEST_DIR, '../test');
  var capitalizedPlural = (0, _capitalize2.default)(endpoints);

  _mustache2.default.escape = function (v) {
    return v;
  };

  var scaffold = new _scaffoldGenerator2.default({
    data: (0, _extends3.default)({}, (0, _ramda.pickBy)(function (val, key) {
      return (0, _ramda.startsWith)('scaffold_', key);
    }, (0, _extends3.default)({}, _config2.default, {
      scaffold_entities: endpoints,
      scaffold_entity: endpoint,
      scaffold_entities_capitalized: capitalizedPlural,
      scaffold_entity_id: endpoint + 'Id',
      scaffold_entity_route_id: '{' + endpoint + 'Id}',
      scaffold_entity_capitalise: title,
      scaffold_factory: title.toLowerCase()
    }))),
    ignore: _config2.default.FILES_IGNORE,
    render: _mustache2.default.render
  });

  _promise2.default.all([scaffold.copy(SCAFFOLD, DEST_DIR), scaffold.copy(TEST, TEST_PATH)]).then(function () {
    console.log('done'); // eslint-disable-line no-console
  }).catch(function (e) {
    console.log(e); // eslint-disable-line no-console
  });
};