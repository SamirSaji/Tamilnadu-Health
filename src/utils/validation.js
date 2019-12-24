const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (isEmpty(value) || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return false;
  }
  return true;
}

export function timeCheck(value) {
  if (isEmpty(value) || !/^([0-9]|0[0-9]|1[0-2])(:|\.)[0-5][0-9]\s*(AM|PM)$/.test(value)) {
    return false;
  }
  return true;
}

export function phoneNumberCheck(value) {
  // RIGHT ==> /^\+(?:[0-9]?){6,14}[0-9]$/ =
  // Currently it check for 10 digit number....
  // /^(?:[0-9]?){6,14}[0-9]$/
  if (isEmpty(value) || !/^(?:[0-9]?){6,14}[0-9]$/i.test(value)) {
    return false;
  }
  return true;
}

export function required(value) {
  if (isEmpty(value)) {
    return false;
  }
  return true;
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return false;
    }
    return true;
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return false;
    }
    return true;
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return false;
  }
  return true;
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return false;
    }
    return true;
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return false;
      }
      return true;
    }
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
