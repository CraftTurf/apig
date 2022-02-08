import hapiAuthJwt2 from 'hapi-auth-jwt2';
import { server, mongooseConnect, CrudApiArgs, CrudServer } from '@ctt/crud-api';
import { permit } from '@ctt/service-utils';
import redisPlugin from '@ctt/redis-client';
import '../env';

import conf from './config';
import mongooseSchema from './persistence/mongoose/queries';
import routes from './routes';
import services from './services';

import config, { configFiles } from './utils/loadconfig';

config.loadFile(configFiles);


interface {{{scaffold_server_name}}}Server extends CrudServer {
  permissions: PermissionOnRedis;
}

interface Permission {
  c?: number;
  r?: number;
  u?: number;
  d?: number;
}

export type Map<T> = { [k: string]: T };

type ResourcePermission = Map<Permission>;

type PermissionOnRedis = Map<ResourcePermission[]>;

type PermissionsQuery = (role: string) => Promise<ResourcePermission[]>;

interface DataSource {
  query: PermissionsQuery;
}

type datasource = (app: {{{scaffold_server_name}}}Server) => Promise<DataSource>;

const datasource = async (application: {{{scaffold_server_name}}}Server): Promise<DataSource> => {
  const { redis } = application.plugins['@ctt/redis-client'];

  return {
    query: async (role: string): Promise<ResourcePermission[]> => {
      const permissions: PermissionOnRedis =
        application.permissions ||
        JSON.parse(await redis.get(`${config.get('service.project')}:${config.get('service.name')}:Permissions`));

      application.permissions = permissions;

      return permissions[role];
    },
  };
};

export interface JsonError {
  code: number;
  message: string;
  title: string;
}

interface PermitResponse {
  isValid: boolean;
}

type validate = (application: {{{scaffold_server_name}}}Server) => Promise<PermitResponse>;

const validate = (application: {{{scaffold_server_name}}}Server) => async (
  { role },
  { route },
): Promise<PermitResponse> => {
  const permissions = await permit.getPermissions({
    role,
    datasource: await datasource(application),
  });

  return permit.authorize(permissions, {
    method: route.method,
    fingerprint: route.fingerprint,
  });
};

export default (): Promise<CrudServer> =>
  server({
    dbConnect: mongooseConnect,
    schema: mongooseSchema,
    config: conf,
    configFiles,
    configOptions: {
      dbConnectOptions: { useNewUrlParser: true, useFindAndModify: false },
    },
    routes,
    services,
    plugins: [
      { plugin: hapiAuthJwt2, options: {} },
      {
        plugin: redisPlugin,
        options: {
          mode: config.get('redis.mode'),
          options: config.get('redis.options'),
        },
      },
    ],
    postRegisterHook: async application => {
      application.auth.strategy('jwt', 'jwt', {
        key: config.get('jwt.secret'),
        validate: await validate(application),
        verifyOptions: { algorithms: ['HS256'] },
        urlKey: false,
      });
      application.auth.default('jwt');
    },
    swaggerOptions: {
      auth: false,
      tags: {},
      info: {
        title: '{{{scaffold_project_name}}}',
        description: '{{{scaffold_project_description}}}',
        version: '0.0.1',
      },
    },
    swaggerUiOptions: {
      title: '{{{scaffold_project_name}}}',
      path: '/docs',
      authorization: false,
      auth: false,
      swaggerOptions: {
        validatorUrl: null,
      },
    },
    loggerOptions: {
      redact: {
        paths: ['req.headers.authorization', '*.password'],
        remove: true,
      },
    },
  } as CrudApiArgs);
