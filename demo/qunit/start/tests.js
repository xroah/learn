QUnit.test("hello test", assert => {
    //assert.ok("1" == 1, "Passed");
    //var value = "hello";
    //assert.equal(value, "hello", "We expect value to be hello.");
    let obj = {foo: "bar"};
    assert.deepEqual(obj, {foo: "bar"}, "deep equal");
});

