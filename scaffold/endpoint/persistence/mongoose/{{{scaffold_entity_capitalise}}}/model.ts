import paginate from 'mongoose-paginate-v2';
import leanVirtuals from 'mongoose-lean-virtuals';
import { Document, Schema, PaginateModel, model } from 'mongoose';

import { MetaSchema, Persistable, DefaultSchemaOptions } from '../schemas';

interface {{{scaffold_entity_capitalise}}}Fields extends Persistable {
  name: string;
}

export interface {{{scaffold_entity_capitalise}}}I extends {{{scaffold_entity_capitalise}}}Fields, Document {}

export const {{{scaffold_entity_capitalise}}}Schema = new Schema(
  {
    name: { type: String, lowercase: true, trim: true, required: true },
    meta: { type: MetaSchema },
  },
  DefaultSchemaOptions,
);

{{{scaffold_entity_capitalise}}}Schema.virtual('links').get(function() {
  return { self: { href: `/${this.id}` } };
});

{{{scaffold_entity_capitalise}}}Schema.index({ 'meta.created': -1 });
{{{scaffold_entity_capitalise}}}Schema.index({ 'meta.updated': -1 });

{{{scaffold_entity_capitalise}}}Schema.plugin(paginate);
{{{scaffold_entity_capitalise}}}Schema.plugin(leanVirtuals);

type {{{scaffold_entity_capitalise}}} = PaginateModel<{{{scaffold_entity_capitalise}}}I>;

const {{{scaffold_entity_capitalise}}} = model<{{{scaffold_entity_capitalise}}}I>('{{{scaffold_entity_capitalise}}}', {{{scaffold_entity_capitalise}}}Schema) as {{{scaffold_entity_capitalise}}};

export default {{{scaffold_entity_capitalise}}};
