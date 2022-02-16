import Scaffold from 'scaffold-generator';
import mustache from 'mustache';
import capitalize from 'capitalize';
import path from 'path';
import { pickBy, startsWith } from 'ramda';
import mkdirp from 'mkdirp';

import config from './config';

export const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'package.json module name (eg orders, accounts-api, @namespace/payments)',
  },
  {
    type: 'input',
    name: 'description',
    message: 'package.json description of microservice',
  },
  {
    type: 'input',
    name: 'author',
    message: 'package.json author e.g Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)',
    default: () => '',
  },
  {
    type: 'input',
    name: 'giturl',
    message: 'Git repository url e.g git@github.com:jabdul/crud-api.git#master',
    default: () => 'git@github.com',
  },
  {
    type: 'input',
    name: 'organisation',
    message: () => 'Project organisation',
    default: () => 'Craft Turf Ltd',
  },
  {
    type: 'input',
    name: 'directory',
    message: 'Root directory folder name (eg orders, accounts-api, payments)',
  },
  {
    type: 'input',
    name: 'mongodb',
    message: 'Name of MongoDb instance to connect to (eg orders, accounts-api, payments)',
  },
  {
    type: 'input',
    name: 'port',
    message: 'Preferred microservice port number',
    default: () => '4021',
  },
  {
    type: 'input',
    name: 'destination',
    message: 'Microservice installation destination path',
    default: () => path.resolve(__dirname, '../', './src'),
  },
];

export const generator = function ({
  name,
  description,
  author,
  giturl,
  directory,
  mongodb,
  port,
  destination,
  organisation,
}) {
  mkdirp(destination, err => {
    if (err) throw err;
  });

  const SCAFFOLD = path.resolve(__dirname, '../../', 'scaffold/service');
  const DEST_DIR = path.resolve(destination, directory);
  const copyrightYear = new Date().getFullYear();

  const dockerPath = /\b([a-z0-9-]*(?<=\/)[/a-z0-9-]+)\b/.test(name)
    ? /\b([a-z0-9-]*(?<=\/)[/a-z0-9-]+)\b/.exec(name)[0]
    : name;
  const serverName = capitalize(dockerPath);

  new Scaffold({
    data: {
      ...pickBy((val, key) => startsWith('scaffold_', key), {
        ...config,
        ...{
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
          scaffold_service_port: port,
        },
      }),
    },
    ignore: config.FILES_IGNORE,
    render: mustache.render,
  })
    .copy(SCAFFOLD, DEST_DIR)
    .then(() => {
      console.log('done'); // eslint-disable-line no-console
    })
    .catch(e => {
      console.log(e); // eslint-disable-line no-console
    });
};
