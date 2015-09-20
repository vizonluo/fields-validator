var assert = require('assert');
var lodash = require('lodash');
var fieldsValidator = require('../index');

var validateConfig = {
    name: [
        ['required', 'input name please']
    ],
    password: [
        ['minLength', 6, 'too short'],
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
    phone: [
        ['maxLength', 11, 'too long'],
    ],
    email: [
        ['regexp', /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'input a right mail please'],
    ]
};

// values: {field: value}
function shouldNoError(values) {
    it('should no error', function() {
        values.forEach(function(value) {
            var ret = fieldsValidator(validateConfig, value);
            assert.equal(ret.length, 0);
        });
    });
}

// valueRetMap: {value: {field: value}, ret: [{field:fieldname, errMsg: errMsg}]}
function shouldReportError(valueRetMap) {
    it('should report error', function() {
        valueRetMap.forEach(function(valueRet) {
            var ret = fieldsValidator(validateConfig, valueRet.value);
            assert.ok(lodash.isEqual(ret, valueRet.ret));
        });
    });
}

describe('fields validator', function() {
    describe('required', function() {
        var fieldName = 'name';

        var validValues = [
            '12'
        ];

        shouldNoError(validValues.map(function(value) {
            var data = {};
            data[fieldName] = value;
            return data;
        }));

        var unValidValues = [
            ''
        ];
        var errRet = [{
            field: fieldName,
            errMsg: validateConfig[fieldName][0].slice(-1)[0]
        }];
        shouldReportError(unValidValues.map(function(value) {
            var data = {
                value: {},
                ret: errRet
            };
            data.value[fieldName] = value;
            return data;
        }));
    });

    describe('minLength', function() {
        var fieldName = 'password';
        var validValues = [
            '',
            '123456',
            '12adf123331'
        ];
        shouldNoError(validValues.map(function(value) {
            var data = {};
            data[fieldName] = value;
            return data;
        }));

        var unValidValues = [
            '1',
            '12234'
        ];
        var errRet = [{
            field: fieldName,
            errMsg: validateConfig[fieldName][0].slice(-1)[0]
        }];
        shouldReportError(unValidValues.map(function(value) {
            var data = {
                value: {},
                ret: errRet
            };
            data.value[fieldName] = value;
            return data;
        }));
    });

    describe('maxLength', function() {
        var fieldName = 'phone';
        var validValues = [
            '',
            '123456',
            '11111222223'
        ];
        shouldNoError(validValues.map(function(value) {
            var data = {};
            data[fieldName] = value;
            return data;
        }));

        var unValidValues = [
            '111112222233',
            '111112222233333',
        ];
        var errRet = [{
            field: fieldName,
            errMsg: validateConfig[fieldName][0].slice(-1)[0]
        }];
        shouldReportError(unValidValues.map(function(value) {
            var data = {
                value: {},
                ret: errRet
            };
            data.value[fieldName] = value;
            return data;
        }));
    });

    describe('regexp', function() {
        var fieldName = 'email';
        var validValues = [
            '',
            'ab@gmail.com'
        ];
        shouldNoError(validValues.map(function(value) {
            var data = {};
            data[fieldName] = value;
            return data;
        }));

        var unValidValues = [
            'ab.gmail.com'
        ];
        var errRet = [{
            field: fieldName,
            errMsg: validateConfig[fieldName][0].slice(-1)[0]
        }];
        shouldReportError(unValidValues.map(function(value) {
            var data = {
                value: {},
                ret: errRet
            };
            data.value[fieldName] = value;
            return data;
        }));
    });

    describe('custom', function() {
        var fieldName = 'rePassword';
        var validValues = [{
            password: '',
            rePassword: ''
        }, {
            password: '',
            rePassword: 'abc'
        }, {
            password: 'abcabc',
            rePassword: ''
        }, {
            password: 'abcabc',
            rePassword: 'abcabc'
        }];
        shouldNoError(validValues);

        var unValidValues = [{
            password: 'abcabc',
            rePassword: 'abc'
        }];
        var errRet = [{
            field: fieldName,
            errMsg: validateConfig[fieldName][0].slice(-1)[0]
        }];
        shouldReportError(unValidValues.map(function(value) {
            return {
                value: value,
                ret: errRet
            };
        }));

        describe('multi fields', function(){
            it('should report two error', function(){
                var unValidValues = [{
                    password: 'abca',
                    rePassword: 'abc'
                }]

                var errRet = [{
                    field: 'password',
                    errMsg: validateConfig.password[0].slice(-1)[0]
                }, {
                    field: 'rePassword',
                    errMsg: validateConfig.rePassword[0].slice(-1)[0]
                }];

                shouldReportError(unValidValues.map(function(value) {
                    return {
                        value: value,
                        ret: errRet
                    };
                }));
            });
        });
    });

    describe('multi rules', function() {
        var config = {
            name: [
                ['required', 'input name please'],
                ['minLength', 2, 'too short'],
                ['maxLength', 10, 'too long']
            ]
        };

        it('should no error', function() {
            var data = {
                name: 'name'
            };
            var ret = fieldsValidator(config, data);
            assert.equal(ret.length, 0);
        });

        it('should report required error', function() {
            var data = {
                name: ''
            };
            var ret = fieldsValidator(config, data);
            assert.ok(lodash.isEqual(ret, [
                {field: 'name', errMsg: config.name[0].slice(-1)[0]}
            ]));
        });

        it('should report minLength error', function() {
            var data = {
                name: '1'
            };
            var ret = fieldsValidator(config, data);
            assert.ok(lodash.isEqual(ret, [
                {field: 'name', errMsg: config.name[1].slice(-1)[0]}
            ]));
        });

        it('should report maxLength error', function() {
            var data = {
                name: '11111222223'
            };
            var ret = fieldsValidator(config, data);
            assert.ok(lodash.isEqual(ret, [
                {field: 'name', errMsg: config.name[2].slice(-1)[0]}
            ]));
        });
    });
});