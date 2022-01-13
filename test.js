const test = require('tape');
const pull = require('pull-stream');
const xsFromPullStream = require('./index').default;

test('converts pull-stream msg to xstream next()', (t) => {
  t.plan(4);
  const expected = [1, 2, 3];
  const stream = xsFromPullStream(pull.values([1, 2, 3]));
  stream.addListener({
    next: (x) => {
      t.equal(x, expected.shift());
    },
    error: (err) => {
      t.fail(err);
    },
    complete: () => {
      t.pass('complete');
    },
  });
});

test('converts pull-stream error to xstream error()', (t) => {
  t.plan(1);
  const stream = xsFromPullStream(pull.error(new Error('badbad')));
  stream.addListener({
    next: (x) => {
      t.fail('should not be called');
    },
    error: (err) => {
      t.equal(err.message, 'badbad');
    },
    complete: () => {
      t.fail('should not be called');
    },
  });
});

test('converts pull-stream end to xstream complete()', (t) => {
  t.plan(1);
  const stream = xsFromPullStream(pull.empty());
  stream.addListener({
    next: (x) => {
      t.fail('should not be called');
    },
    error: (err) => {
      t.fail('should not be called');
    },
    complete: () => {
      t.pass('complete');
    },
  });
});

test('converts xstream cancellation to pull-stream abort', (t) => {
  const stream = xsFromPullStream(function random(end, cb) {
    if (end) {
      t.pass('aborted');
      cb(end);
      t.end();
    }
  });
  const sub = stream.subscribe({});
  setTimeout(() => {
    sub.unsubscribe();
  });
});
