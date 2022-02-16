import { factory } from 'factory-girl';

import './meta';

import {{{scaffold_entity_capitalise}}} from '../../src/persistence/mongoose/{{{scaffold_entity_capitalise}}}/model'

export default factory.define('{{{scaffold_entity_capitalise}}}', {{{scaffold_entity_capitalise}}}, {
  name: 'test',
  meta: factory.assocAttrs('Meta'),
});
