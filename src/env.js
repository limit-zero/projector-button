const { makeValidator, cleanEnv, port } = require('envalid');

const nonemptystr = makeValidator((v) => {
  const err = new Error('Expected a non-empty string');
  if (v === undefined || v === null || v === '') {
    throw err;
  }
  const trimmed = String(v).trim();
  if (!trimmed) throw err;
  return trimmed;
});

module.exports = cleanEnv(process.env, {
  PORT: port({ desc: 'The port to run the server on.', default: 4999 }),
  USERNAME: nonemptystr({ desc: 'The projector username.' }),
  PASSWORD: nonemptystr({ desc: 'The projector password.' }),
});
