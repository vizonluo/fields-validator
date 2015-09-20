function validateVal(val, rules, formData) {
    var result = '';

    rules.every(function(ruleArr) {
        var isValid = true;
        var errMsg = ruleArr.slice(-1)[0];
        switch (ruleArr[0]) {
            case 'required':
                isValid = val !== '';
                break;
            case 'maxLength':
                if (val === '') {
                    isValid = true;
                } else {
                    isValid = val.length <= ruleArr[1];
                }
                break;
            case 'minLength':
                if (val === '') {
                    isValid = true;
                } else {
                    isValid = val.length >= ruleArr[1];
                }
                break;
            case 'regexp':
                if (val === '') {
                    isValid = true;
                } else {
                    isValid = ruleArr[1].test(val);
                }
                break;
            case 'custom':
                isValid = ruleArr[1](formData);
                break;
            default:
                isValid = true;
        }
        if (!isValid) {
            result = errMsg;
        }

        return isValid;
    });

    return result;
}

function validate(validateConfig, formData) {
    return Object.keys(formData).reduce(function(resultArr, key) {
        var val = formData[key];
        var rules = validateConfig[key];

        if (!rules) {
            return resultArr;
        }

        var errMsg = validateVal(val, rules, formData);
        if (errMsg) {
            resultArr.push({
                field: key,
                errMsg: errMsg
            });
        }
        return resultArr;
    }, []);
}

module.exports = validate;