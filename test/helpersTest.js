const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user, true);
  });
  it('should return a user with undefined', function() {
    const user = getUserByEmail("user1@example.com", testUsers)
    const expectedUserID = "user1RandomID";
    // Write your assert statement here
    assert.equal(user, undefined);
  });
});

// describe('tempConverter', () => {
//   it('should return a number, not a string', () => {
//     let result = tempConverter(100, true);

//     assert.ok(typeof result === "number");
//   });

//   it('converts to Fahrenheit correctly (42C => 107.6F)', () => {
//     let result = tempConverter(42, true);

//     assert.equal(result, 107.6);
//   });

//   it('converts to Celsius correctly (42F => 5.6C)', () => {
//     let result = tempConverter(42, false);

//     assert.equal(result, 5.6);
//   });

//   it('returns NaN if it is not given a number ("42" => NaN)', () => {
//     let result = tempConverter("42", true);

//     assert.notEqual(result, undefined);
//     assert.ok(isNaN(result));
//   });
// });
