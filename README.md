
# fields-validator

[![Build Status](https://api.travis-ci.org/vizonluo/fields-validator.svg?branch=master)](https://travis-ci.org/vizonluo/fields-validator)

a simple validator for form fields

## Install
```
    npm install fields-validator --save
```

## Usage
```javascript
var fieldsValidator = require('fields-validator');

var validateConfig = {
    name: [
        ['required', 'input name please']
    ],
    password: [
        ['minLength', 6, 'too short'],
        ['maxLength', 11, 'too long']
    ],
    rePassword: [
        ['custom', function(data) {
            if (data.password === '' ||
                data.rePassword === '' ||
                data.password === data.rePassword
            ) {
                return true;
            }
            return false;
        }, 'should be equal to password']
    ],
    email: [
        ['regexp', /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'input a right mail please'],
    ]
};

var formData = {
    name: '',
    password: 'abc',
    rePassword: 'abcd',
    email: 'abc@gmail.com'
};

var ret = fieldsValidator(validateConfig, formData);
console.log(ret);
// output
// [ { field: 'name', errMsg: 'input name please' },
//   { field: 'password', errMsg: 'too short' },
//   { field: 'rePassword', errMsg: 'should be equal to password' } ]
```

- [relative](./docs/relative.md)
