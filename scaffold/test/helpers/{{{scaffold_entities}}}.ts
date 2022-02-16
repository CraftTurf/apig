const attrs = ['name', 'meta.active'];

export const verify{{{scaffold_entity_capitalise}}} = ({{{scaffold_entity}}}): void => {
  attrs.forEach(attr => {
    expect({{{scaffold_entity}}}).toHaveProperty(attr);
  });
};

export const verifyResponse = ({{{scaffold_entity}}}, payload): void => {
  attrs.forEach(attr => {
    expect({{{scaffold_entity}}}[attr]).toEqual(payload[attr]);
  });
};
