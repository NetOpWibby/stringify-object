# @webb/stringify-object

> Stringify an Object/Array like JSON.stringify, but the way you want it.

Useful for when you want to get the string representation of an object in a formatted way.

It also handles circular references and lets you specify quote type.



## Install

```sh
$ npm i @webb/stringify-object
```



## Usage

```js
import stringifyObject from "@webb/stringify-object";

const myObj = {
  foo: "bar",
  "arr": [1, 2, 3],
  nested: {
    hello: "world"
  }
};

const pretty = stringifyObject(myObj, {
  indent: "  "
});

console.log(pretty);

/*
{
  foo: "bar",
  arr: [
    1,
    2,
    3
  ],
  nested: {
    hello: "world"
  }
}
*/
```



## API

### stringifyObject(input, options?)

Circular references will be replaced with `"[Circular]"`.

Object keys are only quoted when necessary, for example, `{ "foo-bar": true }`.

#### input

- Type: `Object | Array`

#### options

- Type: `object`

##### filter(object, property)

- Type: `Function`

Expected to return a `Boolean` of whether to include the property `property` of the object `object` in the output.

##### indent

- Type: `String`
- Default: `  ` (two spaces)

Preferred indentation.

##### inlineCharacterLimit

Type: `number`

When set, will inline values up to `inlineCharacterLimit` length for the sake of more terse output.

For example, given the example at the top of the README:

```js
import stringifyObject from "@webb/stringify-object";

const object = {
  foo: "bar",
  "arr": [1, 2, 3],
  nested: {
    hello: "world"
  }
};

const pretty = stringifyObject(object, {
  inlineCharacterLimit: 12
});

console.log(pretty);

/*
{
  foo: "bar",
  arr: [1, 2, 3],
  nested: {
    hello: "world"
  }
}
*/
```

As you can see, `arr` was printed as a one-liner because its string was shorter than 12 characters.

##### singleQuotes

- Type: `Boolean`
- Default: `false`

Strings are double-quoted by default.

##### strict

- Type: `Boolean`
- Default: `false`

When true, keys are wrapped in quotes.

##### transform(object, property, originalResult)

- Type: `Function`
- Default: `undefined`

Expected to return a `String` that transforms the string that resulted from stringifying `object[property]`. This can be used to detect special types of objects that need to be stringified in a particular way. The `transform` function might return an alternate string in this case, otherwise returning the `originalResult`.

Here's an example that uses the `transform` option to mask fields named "password":

```js
import stringifyObject from "@webb/stringify-object";

const obj = {
  user: "shantelle",
  password: "secret"
};

const pretty = stringifyObject(obj, {
  transform: (object, property, originalResult) => {
    if (property === "password")
      return originalResult.replace(/\w/g, "*");

    return originalResult;
  }
});

console.log(pretty);

/*
{
  user: "shantelle",
  password: "******"
}
*/
```



## Tests

```sh
# Run all tests, sequentially
$ npm test

# Test dependencies for latest versions
$ npm run test:dependencies

# Lint "src" directory
$ npm run test:typescript

# Test this module
$ npm run test:assert

# Test coverage for the `test:assert` script
$ npm run test:coverage
```



## Thanks

The original [stringify-object](https://github.com/yeoman/stringify-object) module is by [sindresorhus](https://github.com/sindresorhus) for [yeoman](https://github.com/yeoman). I found it useful for a GraphQL project but needed a *slight* adjustment and well, ended up making several more adjustments.
