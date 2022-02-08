import { pickBy, path } from 'ramda';
import { timezone, intl } from '@ctt/service-utils';

import {{{scaffold_entity_capitalise}}}, { {{{scaffold_entity_capitalise}}}I } from './model';
import { LeanDocument, PaginateResult } from 'mongoose';
import { QueryArgs, DbClient, Query } from '@ctt/crud-api';

const create = async ({ payload }: QueryArgs): Promise<LeanDocument<{{{scaffold_entity_capitalise}}}I>> => {
  const {{{scaffold_entity}}} = new {{{scaffold_entity_capitalise}}}({
    ...payload,
    meta: { ...payload.meta, ...{ created: timezone.parse(Date.now(), intl.tz.WAT) } },
  });

  return (await {{{scaffold_entity}}}.save()).toObject();
};

const findAll = async ({ payload }: QueryArgs): Promise<PaginateResult<LeanDocument<{{{scaffold_entity_capitalise}}}I>>> =>
  {{{scaffold_entity_capitalise}}}.paginate(
    {
      ...pickBy(val => !!val, {
        name: path(['name'], payload),
        'meta.created': path(['from'], payload) && {
          $gte: path(['from'], payload),
          $lte: path(['to'], payload),
        },
        'meta.active': true,
      }),
    },
    {
      page: payload.page,
      limit: payload.limit,
      [payload.offset && 'offset']: payload.offset,
      lean: true,
      leanWithId: true,
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc' },
    },
  );

const findById = async ({ payload }: QueryArgs): Promise<{{{scaffold_entity_capitalise}}}I> =>
  {{{scaffold_entity_capitalise}}}.findOne({ _id: payload.id, 'meta.active': true }).lean({ virtuals: true });

const removeById = async ({ payload }: QueryArgs): Promise<object> =>
  {{{scaffold_entity_capitalise}}}.updateOne(
    { _id: payload.id, 'meta.active': true },
    { $set: { 'meta.active': false, 'meta.updated': timezone.parse(Date.now(), intl.tz.WAT) } },
  );

const updateById = async ({ payload }: QueryArgs): Promise<object> =>
  {{{scaffold_entity_capitalise}}}.updateOne(
    { _id: payload.id, 'meta.active': true },
    {
      $set: {
        ...pickBy(val => !!val, {
          ...payload,
          'meta.updated': timezone.parse(Date.now(), intl.tz.WAT),
        }),
      },
    },
  );

export default (client: DbClient): Query<{{{scaffold_entity_capitalise}}}I | LeanDocument<{{{scaffold_entity_capitalise}}}I>> => ({
  create: ({ payload, config }: QueryArgs): Promise<LeanDocument<{{{scaffold_entity_capitalise}}}I>> =>
   create({ client, payload, config }),
  findAll: ({ payload }: QueryArgs): Promise<PaginateResult<LeanDocument<{{{scaffold_entity_capitalise}}}I>>> =>
   findAll({ payload, client }),
  findById: ({ payload }: QueryArgs): Promise<{{{scaffold_entity_capitalise}}}I> =>
   findById({ payload, client }),
  removeById: ({ payload }: QueryArgs): Promise<object> =>
   removeById({ payload, client }),
  updateById: ({ payload }: QueryArgs): Promise<object> =>
   updateById({ payload, client }),
});
