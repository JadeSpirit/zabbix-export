# json2array

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7f39dc2b8a6d4b149fb18497ca6c9538)](https://www.codacy.com/app/holvonix-open/json2array?utm_source=github.com&utm_medium=referral&utm_content=holvonix-open/json2array&utm_campaign=badger)
[![Build Status](https://travis-ci.org/holvonix-open/json2array.svg?branch=master)](https://travis-ci.org/holvonix-open/json2array)
[![npm version](https://badge.fury.io/js/json2array.svg)](https://badge.fury.io/js/json2array)
[![Greenkeeper badge](https://badges.greenkeeper.io/holvonix-open/json2array.svg)](https://greenkeeper.io/)
[![codecov](https://codecov.io/gh/holvonix-open/json2array/branch/master/graph/badge.svg)](https://codecov.io/gh/holvonix-open/json2array)
[![Maintainability](https://api.codeclimate.com/v1/badges/6217484ac553304f9e05/maintainability)](https://codeclimate.com/github/holvonix-open/json2array/maintainability)

Convert JSON to an array

[![NPM](https://nodei.co/npm/json2array.png?compact=true)](https://nodei.co/npm/json2array/)

## Installation

    npm install json2array

or

    yarn add json2array

## Usage

```js
const json2array = require("json2array");

const obj1 = {
  top: 5,
  nested: {
    deep: {
      leaf: "hello"
    }
  }
};

const obj2 = {
  top: "a700",
  nested: {
    deep: {
      leaf: "goodbye"
    }
  }
};

// 'hello'
json2array.dottedGet(obj1, "nested.deep.leaf");

// [5, 'hello']
json2array.map2array(obj1, ["top", "nested.deep.leaf"]);

// [[5, 'hello'], ['a700', 'goodbye']]
json2array.maps2arrays([obj1, obj2], ["top", "nested.deep.leaf"]);
```

## Notice and License

```
# json2array

Copyright (c) 2017 Holvonix LLC and the json2array AUTHORS

Original Repository: https://github.com/holvonix-open/json2array

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Third-party dependencies may have their own licenses.
```
