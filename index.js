function validateVal(val, rules){
    return rules.reduce(function(result, ruleArr){
        var isValid = true;
        var errMsg = ruleArr[ruleArr.length - 1];
        switch (ruleArr[0]) {
            case 'required':
                isValid = val !== '';
                break;
            case 'maxLength':
                isValid = val.length <= ruleArr[1];
                break;
            case 'minLength':
                isValid = val.length >= ruleArr[1];
                break;
            case 'regexp':
                isValid = ruleArr[1].test(val);
                break;
            default:
                isValid = true;
        }
        if(!isValid){
            result = errMsg;
        }

        return result;
    }, '');
}

function validate(validateConfig, formData){
    return Object.keys(validateConfig).reduce(function(resultArr, key){
        var val = formData[key];
        var rules = validateConfig[key];

        if(!rules){
            return resultArr;
        }

        var errMsg = validateVal(val, rules);
        if(errMsg) {
            resultArr.push({
                field: key,
                errMsg: errMsg
            });
        }
        return resultArr;
    }, []);
}

module.exports = validate;