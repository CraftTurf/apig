import { http } from '@ctt/service-utils';
import {
  makeMetaRequestPayloadSchema,
} from '../utils/schemas';

const {
  response: { UNPROCESSABLE_ENTITY, BAD_REQUEST, NOT_FOUND, CREATED, OK, HAL_JSON_TYPE },
} = http;

export const ROUTE_NAME = '{{{scaffold_entities}}}';

const options = {
  log: { collect: true },
  auth: 'jwt',
  cors: {
    origin: ['*'],
    additionalHeaders: ['X-Requested-With', 'Origin'],
  },
};

export const makeRequestPayloadSchema = validate => validate.object().keys({
  name: validate.string().max(30),
  meta: makeMetaRequestPayloadSchema(validate),
});

const makeRequestHeaderSchema = validate => validate.object({
  authorization: validate.string().required(),
}).unknown();

export default ({
  services, config, validate, json
}) => ({
  method: 'POST',
  path: `/${ROUTE_NAME}`,
  options: {
    ...options,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err) => {
        request.log([err]);
        return h
          .response(BAD_REQUEST.message)
          .code(BAD_REQUEST.code)
          .type(HAL_JSON_TYPE)
          .takeover();
      },
      payload: makeRequestPayloadSchema(validate)
        .requiredKeys(
          'name'
        )
        .optionalKeys(
          'meta'
        )
    },
    tags: ['api'],
  },
  handler: async (request, h) => {
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h.response(await services[ROUTE_NAME]
        .create({
          payload: request.payload, config, json
        }))
        .code(CREATED.code)
        .type(HAL_JSON_TYPE);
    } catch (e) {
      request.log([e]);
      response = h.response(UNPROCESSABLE_ENTITY.message).code(UNPROCESSABLE_ENTITY.code);
    }

    return response;
  }
});

export const find{{{scaffold_entity_capitalise}}} = ({
  services, validate, config, json
}) => ({
  method: 'GET',
  path: '/{{{scaffold_entities}}}/{uuid}',
  options: {
    ...options,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err) => {
        request.log([err]);
        return h
          .response(BAD_REQUEST.message)
          .code(BAD_REQUEST.code)
          .type(HAL_JSON_TYPE)
          .takeover();
      },
      params: {
        uuid: validate.string().guid({
          version: ['uuidv4']
        }),
      },
    },

    tags: ['api'],
  },
  handler: async (request, h) => {
    const payload = { uuid: request.params.uuid };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h.response(await services[ROUTE_NAME]
        .findById({ payload, config, json }))
        .code(OK.code)
        .type(HAL_JSON_TYPE);
    } catch (e) {
      request.log([e]);
      response = h.response(NOT_FOUND.message).code(NOT_FOUND.code);
    }

    return response;
  }
});

export const findAll{{{scaffold_entity_capitalise}}}s = ({
  services, validate, config, json
}) => ({
  method: 'GET',
  path: '/{{{scaffold_entities}}}/page/{pageid}',
  options: {
    ...options,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err) => {
        request.log([err]);
        return h
          .response(BAD_REQUEST.message)
          .code(BAD_REQUEST.code)
          .type(HAL_JSON_TYPE)
          .takeover();
      },
      params: {
        pageid: validate.number().integer().min(1),
      },
      query: {
        name: validate.string().max(30),
        from: validate.date().iso(),
        to: validate.date().iso(),
        limit: validate.number().integer().min(1),
      },
    },

    tags: ['api'],
  },
  handler: async (request, h) => {
    const payload = {
      pageid: request.params.pageid,
      name: request.query.name,
      from: request.query.from,
      to: request.query.to,
      limit: request.query.limit,
    };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h.response(await services[ROUTE_NAME]
        .findAll({ payload, config, json }))
        .code(OK.code)
        .type(HAL_JSON_TYPE);
    } catch (e) {
      request.log([e]);
      response = h.response(NOT_FOUND.message).code(NOT_FOUND.code);
    }

    return response;
  }
});

export const remove{{{scaffold_entity_capitalise}}} = ({
  services, validate, config, json
}) => ({
  method: 'DELETE',
  path: '/{{{scaffold_entities}}}/{uuid}',
  options: {
    ...options,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err) => {
        request.log([err]);
        return h
          .response(BAD_REQUEST.message)
          .code(BAD_REQUEST.code)
          .type(HAL_JSON_TYPE)
          .takeover();
      },
      params: {
        uuid: validate.string().guid({
          version: ['uuidv4']
        }),
      },
    },

    tags: ['api'],
  },
  handler: async (request, h) => {
    const payload = { uuid: request.params.uuid };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h.response(await services[ROUTE_NAME]
        .removeById({ payload, config, json }))
        .code(204);
    } catch (e) {
      response = h.response(UNPROCESSABLE_ENTITY.message).code(UNPROCESSABLE_ENTITY.code);
    }

    return response;
  }
});

export const update{{{scaffold_entity_capitalise}}} = ({
  services, validate, config, json
}) => ({
  method: 'PUT',
  path: '/{{{scaffold_entities}}}/{uuid}',
  options: {
    ...options,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err) => {
        request.log([err]);
        return h
          .response(BAD_REQUEST.message)
          .code(BAD_REQUEST.code)
          .type(HAL_JSON_TYPE)
          .takeover();
      },
      params: {
        uuid: validate.string().guid({
          version: ['uuidv4']
        }),
      },
      payload: makeRequestPayloadSchema(validate),
    },

    tags: ['api'],
  },
  handler: async (request, h) => {
    const payload = {
      uuid: request.params.uuid,
      name: request.payload.name,
    };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h.response(await services[ROUTE_NAME]
        .updateById({ payload, config, json }))
        .code(OK.code);
    } catch (e) {
      request.log([e]);
      response = h.response(UNPROCESSABLE_ENTITY.message).code(UNPROCESSABLE_ENTITY.code);
    }

    return response;
  }
});