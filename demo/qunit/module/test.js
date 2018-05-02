QUnit.module("Robot");
QUnit.test("test robot", function (assert) {
    assert.ok(true, "This is a robot");
});

QUnit.module.skip("module");
QUnit.test(false, "失败了");

QUnit.module.todo("new feature");
QUnit.test("feature1", function(assert) {
    assert.ok(false, "失败了");
});

/* QUnit.module.only("Android", {
    before() {
        console.log("开始")
    },
    beforeEach() {
        console.log("测试开始")
    },
    afterEach() {
        console.log("测试结束");
    },
    after() {
        console.log("结束");
    }
}, function(hooks) {
    //before先执行,在执行module的before回调
    hooks.before(function() {
        console.log("test started");
    });
    QUnit.test("android", function (assert) {
        assert.equal("hah", "hah", "相等");
    });
    QUnit.test("android1", function(assert) {
        assert.ok(true, "通过");
    });
}); */

