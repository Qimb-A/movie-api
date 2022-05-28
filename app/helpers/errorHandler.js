module.exports = (error = {}) => {
  const result = { status: 0, fields: {}, code: '' };
  result.fields[error.errors[0].path] = error.errors[0].validatorKey.toUpperCase();
  result.code += `${error.errors[0].message}`;
  return result;
};
