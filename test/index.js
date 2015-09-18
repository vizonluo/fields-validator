var assert = require('assert');
var fieldsValidator = require('../index');

var validateConfig = {
    picUrl: [
        ['required', '请上传页面底图']
    ],
    activityInstruction: [
        ['required', '请输入活动规则说明'],
    ],
    receivedReminder: [
        ['required', '请输入已领取过时提示'],
    ],
    expiredReminder: [
        ['required', '请输入活动过期时提示'],
    ],
    wrongMobileReminder: [
        ['required', '请输入手机号输入有误时提示'],
    ]
};

describe('fields validator', function() {
    it('should no error', function(){
        var ret = fieldsValidator(validateConfig, {
            picUrl: 'ab'
        });
        assert.equal(ret.length, 0);
    });
    it('should report one error', function(){
        var ret = fieldsValidator(validateConfig, {
            picUrl: ''
        });
        assert.equal(ret.length, 1);
    });
    it('should report error message: "请上传页面底图"', function() {
        var ret = fieldsValidator(validateConfig, {
            picUrl: ''
        });
        assert.equal(ret[0].errMsg, '请上传页面底图');
    });
});