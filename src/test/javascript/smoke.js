var test = require('tape');

test('smoke:simple', function (t) {
    t.plan(2);

    t.equal(2 + 3, 5);
    t.equal(7 * 8 + 9, 65);
});

test('smoke:more', function(t) {
  t.plan(1);
  // Updated source code
  t.equal(3,2); // djb123
});
