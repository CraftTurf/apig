import tmplJson from './parsers/json';
import { Dict, Crud, ServiceArgs } from '@ctt/crud-api';
import { pickBy } from 'ramda';
import { {{{scaffold_entity_capitalise}}}I } from '../persistence/mongoose/{{{scaffold_entity_capitalise}}}/model';
import { PaginateResult } from 'mongoose';
import { responseDocumentSchema, createPaginationLink } from '../utils/schemas';

const create = async ({ db, payload, config, json }: ServiceArgs): Promise<string> => {
  const {{{scaffold_entity}}} = await db.{{{scaffold_entities}}}.create({ payload, config });

  if (!{{{scaffold_entity}}}) {
    throw Error({{{scaffold_entity}}});
  }

  return json(responseDocumentSchema(tmplJson))({ data: [{{{scaffold_entity}}}] });
};

const findById = async ({ db, payload, config, json }: ServiceArgs): Promise<string> => {
  const {{{scaffold_entity}}} = await db.{{{scaffold_entities}}}.findById({ payload, config });

  if (!{{{scaffold_entity}}}) {
    throw Error({{{scaffold_entity}}});
  }

  return json(responseDocumentSchema(tmplJson))({ data: [{{{scaffold_entity}}}] });
};

const findAll = async ({ db, payload, config, json }: ServiceArgs): Promise<string> => {
  const {{{scaffold_entities}}} = (await db.{{{scaffold_entities}}}.findAll({ payload, config })) as PaginateResult<{{{scaffold_entity_capitalise}}}I>;

  if (!{{{scaffold_entities}}}) {
    throw Error(`${ {{{scaffold_entities}}} }`);
  }

  if ({{{scaffold_entities}}}.docs.length < 1) {
    throw Error('Could not find {{{scaffold_entities}}}');
  }

  const {
    docs,
    totalDocs: items,
    nextPage,
    prevPage,
    totalPages: pages,
    page,
    hasNextPage,
    hasPrevPage,
    limit,
    pagingCounter,
  } = {{{scaffold_entities}}};

  const {{{scaffold_entity}}}Paginator = createPaginationLink('{{{scaffold_entities}}}');

  const next = hasNextPage && {{{scaffold_entity}}}Paginator(nextPage, limit);
  const previous = hasPrevPage && {{{scaffold_entity}}}Paginator(prevPage, limit);
  const first = {{{scaffold_entity}}}Paginator(page, 1, pagingCounter - 1);
  const last = {{{scaffold_entity}}}Paginator(page, 1, pagingCounter - 2 + docs.length);
  const current = {{{scaffold_entity}}}Paginator(page, limit);

  return json(responseDocumentSchema(tmplJson))({
    data: docs,
    pagination: pickBy(val => !!val, { items, next, previous, pages, first, last, current }),
  });
};

const removeById = async ({ db, payload, config }: ServiceArgs): Promise<void> => {
  const result = await db.{{{scaffold_entities}}}.removeById({ payload, config });

  if (!result.nModified) {
    throw Error(result);
  }
};

const updateById = async ({ db, payload, config }: ServiceArgs): Promise<object> => {
  const result = await db.{{{scaffold_entities}}}.updateById({ payload, config });

  if (!result.nModified) {
    throw Error(result);
  }

  return result;
};

export default (db: Dict): Crud<string> => ({
  create: ({ payload, config, json }: ServiceArgs): Promise<string> =>
    create({
      db,
      payload,
      config,
      json,
    }),
  findById: ({ payload, config, json }: ServiceArgs): Promise<string> =>
    findById({
      db,
      payload,
      config,
      json,
    }),
  findAll: ({ payload, config, json }: ServiceArgs): Promise<any> => // eslint-disable-line
    findAll({
      db,
      payload,
      config,
      json,
    }),
  removeById: ({ payload, config, json }: ServiceArgs): Promise<void> =>
    removeById({
      db,
      payload,
      config,
      json,
    }),
  updateById: ({ payload, config, json }: ServiceArgs): Promise<object> =>
    updateById({
      db,
      payload,
      config,
      json,
    }),
});
