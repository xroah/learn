/* QUnit.test("hello test", assert => {
    //assert.ok("1" == 1, "Passed");
    //var value = "hello";
    //assert.equal(value, "hello", "We expect value to be hello.");
    let obj = {foo: "bar"};
    assert.deepEqual(obj, {foo: "bar"}, "deep equal");
}); */

/* QUnit.test( "a test", function( assert ) {
    assert.expect( 2 );
   
    function calc( x, operation ) {
      return operation( x );
    }
   
    var result = calc( 2, function( x ) {
      assert.ok( true, "calc() calls operation function" );
      return x * x;
    });
   
    assert.equal( result, 4, "2 square equals 4" );
  }); */

  QUnit.test( "a test", function( assert ) {
   
    var $body = $( "body" );
   
    $body.on( "click", function() {
      assert.ok( true, "body was clicked!" );
    });
   
    $body.trigger( "click" );
  });
