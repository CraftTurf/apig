import { factory } from 'factory-girl';

import '../../../../test/factories/{{{scaffold_factory}}}';
import queries from './queries';
import  { configFiles } from '../../../utils/loadconfig';
import { verify{{{scaffold_entity_capitalise}}}, verifyResponse } from '../../../../test/helpers/{{{scaffold_entities}}}';

import { mongooseConnect, dbConfig as config } from '@ctt/crud-api';

let db, {{{scaffold_factory}}}Queries;

describe('{{{scaffold_entity_capitalise}}} queries', () => {
  beforeAll(async () => {
    config.loadFile(configFiles);
    db = await mongooseConnect(config);
    {{{scaffold_factory}}}Queries = queries(db);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('create', () => {
    it('can create a {{{scaffold_entity_capitalise}}}', async () => {
      const payload = await factory.attrs('{{{scaffold_entity_capitalise}}}');

      const {{{scaffold_factory}}} = await {{{scaffold_factory}}}Queries.create({ payload });

      expect({{{scaffold_factory}}}).toBeDefined()

      expect({{{scaffold_factory}}}).toHaveProperty('name')
      expect({{{scaffold_factory}}}).toHaveProperty('id')
      expect({{{scaffold_factory}}}['name']).toEqual(payload['name'])
    });

    it('cannot create a {{{scaffold_entity_capitalise}}}', async () => {
      const payload = await factory.attrs('{{{scaffold_entity_capitalise}}}', { name: undefined });

      try {
        await expect(
          await (async () => {{{scaffold_factory}}}Queries.create({ payload }))(),
        ).resolves.toThrow();
      } catch ({ errors, name, message }) {
        expect(name).toBe('ValidationError');
        expect(message).toMatch(/`name` is required/);
        expect(errors).toHaveProperty('name')
        expect(errors['name']['path']).toBe('name');
        expect(errors['name']['kind']).toBe('required');
      }
    })
  })
});
