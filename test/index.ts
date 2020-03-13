


//  N A T I V E

import assert from "assert";

//  I M P O R T

import Test from "@webb/test";

//  U T I L S

import stringifyObject from "../dist";



//  T E S T S

const test = Test("@webb/stringify-object");

/// WARNING
/// What follows is fugly formatting for the sake of testing

const testObject = {
  foo: "bar",
  "arr": [1, 2, 3],
  nested: {
    hello: "world"
  }
};

test("Returns object with no options supplied", () => {
  const expectedResult = `{
  foo: "bar",
  arr: [
    1,
    2,
    3
  ],
  nested: {
    hello: "world"
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject),
    expectedResult
  );
});

test("Ignores empty options object", () => {
  const expectedResult = `{
  foo: "bar",
  arr: [
    1,
    2,
    3
  ],
  nested: {
    hello: "world"
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {}),
    expectedResult
  );
});

test("Ignores nonsense parameters in options object", () => {
  const expectedResult = `{
  foo: "bar",
  arr: [
    1,
    2,
    3
  ],
  nested: {
    hello: "world"
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      me: "i like mitsuya cider"
    }),
    expectedResult
  );
});

test("Returns object indented by one tab", () => {
  const expectedResult = `{
\tfoo: "bar",
\tarr: [
\t\t1,
\t\t2,
\t\t3
\t],
\tnested: {
\t\thello: "world"
\t}
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      indent: "\t"
    }),
    expectedResult
  );
});

test("Returns object indented by one tab and two spaces...yuck", () => {
  const expectedResult = `{
\t  foo: "bar",
\t  arr: [
\t  \t  1,
\t  \t  2,
\t  \t  3
\t  ],
\t  nested: {
\t  \t  hello: "world"
\t  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      indent: "\t  "
    }),
    expectedResult
  );
});

test("Returns object indented by three spaces...idk", () => {
  const expectedResult = `{
   foo: "bar",
   arr: [
      1,
      2,
      3
   ],
   nested: {
      hello: "world"
   }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      indent: "   "
    }),
    expectedResult
  );
});

test("Returns object with values in single quotes", () => {
  const expectedResult = `{
  foo: 'bar',
  arr: [
    1,
    2,
    3
  ],
  nested: {
    hello: 'world'
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      singleQuotes: true
    }),
    expectedResult
  );
});

test("Returns object with keys and values in double quotes", () => {
  const expectedResult = `{
  "foo": "bar",
  "arr": [
    1,
    2,
    3
  ],
  "nested": {
    "hello": "world"
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      strict: true
    }),
    expectedResult
  );
});

test("Returns object with keys and values in single quotes", () => {
  const expectedResult = `{
  'foo': 'bar',
  'arr': [
    1,
    2,
    3
  ],
  'nested': {
    'hello': 'world'
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      singleQuotes: true,
      strict: true
    }),
    expectedResult
  );
});

test("Returns object with value of `arr` key on one line", () => {
  const expectedResult = `{
  foo: "bar",
  arr: [1, 2, 3],
  nested: {
    hello: "world"
  }
}`;

  assert.deepStrictEqual(
    stringifyObject(testObject, {
      inlineCharacterLimit: 12
    }),
    expectedResult
  );
});

test("Returns object with value of `password` key replaced with asterisks", () => {
  const expectedResult = `{
  user: "shantelle",
  password: "******"
}`;

  const thisTestObject = {
    user: "shantelle",
    password: "secret"
  };

  assert.deepStrictEqual(
    stringifyObject(thisTestObject, {
      transform: (object: {}, property: string, originalResult: string) => {
        if (property === "password")
          return originalResult.replace(/\w/g, "*");

        return originalResult;
      }
    }),
    expectedResult
  );
});

test.run();
