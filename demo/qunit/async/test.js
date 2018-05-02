QUnit.module("core", {
  before: function() {
    console.log("test started");
  },
  after: function() {
    console.log("test ended");
  }
});

QUnit.test( "asynchronous test: async input focus", function( assert ) {
  var done = assert.async();
  var input = $( "#test-input" ).focus();
  setTimeout(function() {
    assert.equal( document.activeElement, input[0], "Input was focused" );
    done();
  });
});