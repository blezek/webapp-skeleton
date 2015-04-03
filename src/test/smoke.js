var test = require('tape');

test('smoke:simple', function (t) {
    t.plan(2);

    t.equal(2 + 3, 5);
    t.equal(7 * 8 + 9, 65);
});
