
/*
// SAMPLE TEMPLATE
describe("Test SOMETHING", function() {
	it('should fail', function() { 
		expect(true).to.be.false; 
	});
});
//*/ 



describe("Test the hello.js file", function() {
	var testStr = "This is a test string";
	var returnStr;

	beforeEach(function() {
		returnStr = helloTest(testStr);
	});
	afterEach(function() { 

	});

	it('helloTest function should return the same value as in', function() { 
		expect(testStr).to.be.equal(returnStr); 
	});
});



describe('greeter', function () {

  it('should say Hello to the World', function () {
    expect(greet('World')).to.equal('Hello, World!');
  });
});