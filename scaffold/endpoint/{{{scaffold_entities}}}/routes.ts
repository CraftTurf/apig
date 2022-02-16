import { http, service } from '@ctt/service-utils';
import {
  makeMetaRequestPayloadSchema,
  validateObjectId,
  responseDocumentSchema,
} from '../utils/schemas';
import { ServerRoute, ResponseObject, RouteOptions } from '@hapi/hapi';
import { RouteArgs } from '@ctt/crud-api';
import { ObjectSchema, Root } from 'joi';
import tmplJson from './parsers/json';

const {
  response: { UNPROCESSABLE_ENTITY, BAD_REQUEST, NOT_FOUND, CREATED, OK, JSON_TYPE },
} = http;

export const ROUTE_NAME = '{{{scaffold_entities}}}';

export const makeRequestPayloadSchema = (validate: Root): ObjectSchema =>
  validate.object().keys({
    name: validate
      .string()
      .min(1)
      .required(),
    meta: makeMetaRequestPayloadSchema(validate),
  });

const makeRequestHeaderSchema = (validate: Root): ObjectSchema =>
  validate
    .object({
      authorization: validate.string().required(),
    })
    .unknown();

export default ({ services, config, json, validate }: RouteArgs): ServerRoute => ({
  method: 'POST',
  path: `/${ROUTE_NAME}`,
  options: {
    ...service.options.secureOption,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err): Promise<ResponseObject> => {
        request.log('error', err);

        const { code } = BAD_REQUEST;

        return h
          .response(
            json(responseDocumentSchema(tmplJson))({
              error: { message: 'Validation Error', code },
            }),
          )
          .code(code)
          .type(JSON_TYPE)
          .takeover();
      },
      payload: makeRequestPayloadSchema(validate),
    },
    tags: ['api', '{{{scaffold_entities}}}'],
  } as RouteOptions,
  handler: async (request, h): Promise<ResponseObject> => {
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h
        .response(
          await services[ROUTE_NAME].create({
            payload: request.payload,
            config,
            json,
          }),
        )
        .code(CREATED.code);
    } catch (e) {
      request.log([e]);
      const { code, message } = UNPROCESSABLE_ENTITY;

      response = h
        .response(
          json(responseDocumentSchema(tmplJson))({
            error: { message, code },
          }),
        )
        .code(code);
    }

    return response.type(JSON_TYPE);
  },
});

export const find{{{scaffold_entity_capitalise}}} = ({ services, validate, json, config }: RouteArgs): ServerRoute => ({
  method: 'GET',
  path: `/${ROUTE_NAME}/{{{scaffold_entity_route_id}}}`,
  options: {
    ...service.options.secureOption,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err): Promise<ResponseObject> => {
        request.log('error', err);
        const { code, message } = BAD_REQUEST;

        return h
          .response(
            json(responseDocumentSchema(tmplJson))({
              error: { message, code },
            }),
          )
          .code(code)
          .type(JSON_TYPE)
          .takeover();
      },
      params: {
        {{{scaffold_entity_id}}}: validateObjectId(validate),
      },
    },
    tags: ['api', '{{{scaffold_entities}}}'],
  } as RouteOptions,
  handler: async (request, h): Promise<ResponseObject> => {
    const payload = { id: request.params.{{{scaffold_entity_id}}} };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h
        .response(await services[ROUTE_NAME].findById({ payload, json, config }))
        .code(OK.code);
    } catch (e) {
      request.log([e]);
      const { code, message } = NOT_FOUND;

      response = h
        .response(
          json(responseDocumentSchema(tmplJson))({
            error: { message, code },
          }),
        )
        .code(code);
    }

    return response.type(JSON_TYPE);
  },
});

export const findAll{{{scaffold_entities_capitalized}}} = ({ services, validate, config, json }: RouteArgs): ServerRoute => ({
  method: 'GET',
  path: '/{{{scaffold_entities}}}',
  options: {
    ...service.options.secureOption,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err): Promise<ResponseObject> => {
        request.log('error', err);
        const { code, message } = BAD_REQUEST;

        return h
          .response(
            json(responseDocumentSchema(tmplJson))({
              error: { message, code },
            }),
          )
          .code(code)
          .type(JSON_TYPE)
          .takeover();
      },
      query: {
        name: validate.string().max(30),
        from: validate.date().iso(),
        offset: validate.number().integer(),
        page: validate
          .number()
          .integer()
          .min(1),
        to: validate.date().iso(),
        limit: validate
          .number()
          .integer()
          .min(1),
      },
    },

    tags: ['api', '{{{scaffold_entities}}}'],
  } as RouteOptions,
  handler: async (request, h): Promise<ResponseObject> => {
    const payload = {
      ...request.query,
    };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h
        .response(await services[ROUTE_NAME].findAll({ payload, json, config }))
        .code(OK.code);
    } catch (e) {
      request.log([e]);
      const { code, message } = NOT_FOUND;

      response = h
        .response(
          json(responseDocumentSchema(tmplJson))({
            error: { message, code },
          }),
        )
        .code(code);
    }

    return response.type(JSON_TYPE);
  },
});

export const remove{{{scaffold_entity_capitalise}}} = ({ services, validate, config, json }: RouteArgs): ServerRoute => ({
  method: 'DELETE',
  path: `/${ROUTE_NAME}/{{{scaffold_entity_route_id}}}`,
  options: {
    ...service.options.secureOption,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err): Promise<ResponseObject> => {
        request.log('error', err);
        const { code, message } = BAD_REQUEST;

        return h
          .response(
            json(responseDocumentSchema(tmplJson))({
              error: { message, code },
            }),
          )
          .code(code)
          .type(JSON_TYPE)
          .takeover();
      },
      params: {
        {{{scaffold_entity_id}}}: validateObjectId(validate),
      },
    },

    tags: ['api', '{{{scaffold_entities}}}'],
  } as RouteOptions,
  handler: async (request, h): Promise<ResponseObject> => {
    const payload = { id: request.params.{{{scaffold_entity_id}}} };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h.response(await services[ROUTE_NAME].removeById({ payload, config })).code(204);
    } catch (e) {
      const { code, message } = UNPROCESSABLE_ENTITY;

      response = h
        .response(
          json(responseDocumentSchema(tmplJson))({
            error: { message, code },
          }),
        )
        .code(code);
    }

    return response.type(JSON_TYPE);
  },
});

export const update{{{scaffold_entity_capitalise}}} = ({ services, validate, config, json }: RouteArgs): ServerRoute => ({
  method: 'PUT',
  path: `/${ROUTE_NAME}/{{{scaffold_entity_route_id}}}`,
  options: {
    ...service.options.secureOption,
    validate: {
      headers: makeRequestHeaderSchema(validate),
      failAction: async (request, h, err): Promise<ResponseObject> => {
        request.log('error', err);
        const { code, message } = BAD_REQUEST;

        return h
          .response(
            json(responseDocumentSchema(tmplJson))({
              error: { message, code },
            }),
          )
          .code(code)
          .type(JSON_TYPE)
          .takeover();
      },
      params: {
        {{{scaffold_entity_id}}}: validateObjectId(validate),
      },
      payload: makeRequestPayloadSchema(validate),
    },

    tags: ['api', '{{{scaffold_entities}}}'],
  } as RouteOptions,
  handler: async (request, h): Promise<ResponseObject> => {
    const payload = {
      ...(request.payload as object),
      id: request.params.{{{scaffold_entity_id}}},
    };
    request.log([`/${ROUTE_NAME}`]);
    let response;

    try {
      response = h
        .response(await services[ROUTE_NAME].updateById({ payload, config }))
        .code(OK.code);
    } catch (e) {
      request.log([e]);
      const { code, message } = UNPROCESSABLE_ENTITY;

      response = h
        .response(
          json(responseDocumentSchema(tmplJson))({
            error: { message, code },
          }),
        )
        .code(code);
    }

    return response.type(JSON_TYPE);
  },
});
