import Scaffold from 'scaffold-generator';
import capitalize from 'capitalize';
import mustache from 'mustache';
import { resolve } from 'path';
import { pickBy, startsWith } from 'ramda';
import mkdirp from 'mkdirp';

import config from './config';

export const questions = [
  {
    type: 'input',
    name: 'endpoint',
    message: 'Endpoint name (eg order, account, payment)',
  },
  {
    type: 'input',
    name: 'title',
    message: 'Endpoint title (eg Order, Account, Payment)',
    default: answers => capitalize(answers.endpoint),
  },
  {
    type: 'input',
    name: 'endpoints',
    message: () => 'Endpoint pluralisation (eg orders, accounts, payments)',
    default: answers => `${answers.endpoint}s`,
  },
  {
    type: 'input',
    name: 'destination',
    message: 'Endpopint installation destination',
    default: () => resolve(__dirname, '../', './src'),
  },
];

export const generator = function ({ endpoint, endpoints, title, destination }) {
  mkdirp(destination, err => {
    if (err) throw err;
  });

  const SCAFFOLD = resolve(__dirname, '../../', 'scaffold/endpoint');
  const TEST = resolve(__dirname, '../../', 'scaffold/test');
  const DEST_DIR = destination;
  const TEST_PATH = resolve(DEST_DIR, '../test');
  const capitalizedPlural = capitalize(endpoints);

  mustache.escape = v => v;

  const scaffold = new Scaffold({
    data: {
      ...pickBy((val, key) => startsWith('scaffold_', key), {
        ...config,
        ...{
          scaffold_entities: endpoints,
          scaffold_entity: endpoint,
          scaffold_entities_capitalized: capitalizedPlural,
          scaffold_entity_id: `${endpoint}Id`,
          scaffold_entity_route_id: `{${endpoint}Id}`,
          scaffold_entity_capitalise: title,
          scaffold_factory: title.toLowerCase(),
        },
      }),
    },
    ignore: config.FILES_IGNORE,
    render: mustache.render,
  });

  Promise.all([scaffold.copy(SCAFFOLD, DEST_DIR), scaffold.copy(TEST, TEST_PATH)])
    .then(() => {
      console.log('done'); // eslint-disable-line no-console
    })
    .catch(e => {
      console.log(e); // eslint-disable-line no-console
    });
};
