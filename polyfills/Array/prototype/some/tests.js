// See: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.some

beforeEach(function() {
	this.array = [0, 2, 4, 6, 8, 10, 12, 14];
});

it("Should not accept a function argument that is not callable", function() {
	function assertTypeError(e) {
		expect(e).to.be.a(TypeError);
	}

	var array = this.array;
	expect(function() { array.some({}); }).to.throwException(assertTypeError);
});

it("Should accept a function with three parameters: the value of the element, the index of the element and the object being traversed", function() {
	var array = this.array;

	array.some(function(value, index, object) {
		expect(object).to.be(array);
		expect(object[index]).to.be(value);
		return false;
	});
});

it("Should accept an optional 'this' argument as its second argument which becomes the 'this' value for the function argument", function() {
	var mockThis = { foo: "bar" };
	var array = this.array;

	array.some(function(value) {
		expect(this).to.be(mockThis);
		expect(this.foo).to.be(mockThis.foo);
		return false;
	}, mockThis);
});

it("Should pass a reference to the array as the third parameter to the function argument", function() {
	var array = [10];

	array.some(function(value, index, object) {
		object[0] = 100;
		return false;
	});

	expect(array[0]).to.be(100);
});

it("Should not iterate over elements appended to the array after the call to some.  The range is fixed before the first call to the callback", function() {
	var array = [1, 2, 3, 4, 5, 6];
	var visited = [];

	array.some(function(value, index, object) {
		array.push(index);
		visited[index] = value;
		return false;
	});

	expect(visited).to.eql([1, 2, 3, 4, 5, 6]);

	// Expect the original array to be the same for the first 6 elements, with
	// the additional 0, 1, .. 5 appended (the indices of the first 6 elements
	// in the range covered by some at the start of its invocation
	expect(array).to.eql([1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5]);
});

it("Should return false if the array is empty", function() {
	var a = [];
	expect(a.some(function(value) { return true; })).to.be(false);
});

it("Should not visit elements that are deleted after the call to some begins and before being visited", function() {
	var a = [1, 2, 3, 4, 5, 6];
	var visited = [];

	a.some(function(value, index, object) {
		delete object[5];
		visited.push(index);
		return false;
	});

	// Should only visit the first 5 indices
	expect(visited).to.eql([0, 1, 2, 3, 4]);
});

it("Should return true as soon as the callback returns true", function() {
	var a = [0, 1, 2, 3, 4];
	var visited = [];
	expect(a.some(function(value) {
		visited.push(value);
		return value > 2;
	})).to.be(true);

	expect(visited).to.eql([0, 1, 2, 3]);
});

it("Should return false if the callback never returns true", function() {
	var a = [0, 1, 2, 3, 4];
	var visited = [];
	expect(a.some(function(value) {
		visited.push(value);
		return false;
	})).to.be(false);

	expect(visited).to.eql(a);
});
