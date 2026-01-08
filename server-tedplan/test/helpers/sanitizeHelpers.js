/**
 * Helpers para testar as funções sanitizeInteger e sanitizeDecimal
 * Estas são as mesmas funções do controller
 */

function sanitizeInteger(value) {
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'string' && (value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return null;
  }
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

function sanitizeDecimal(value) {
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'string' && (value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return null;
  }
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

module.exports = {
  sanitizeInteger,
  sanitizeDecimal,
};


