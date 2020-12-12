/**
 * Replaces a character of str with value at a specified index.
 *
 * @param {String} str The string to replace a character of
 * @param {String} value The value to replace with
 * @param {Number} index The index to replace
 */
function replaceAt(str, value, index) {
  return `${str.substring(0, index)}${value}${str.substring(index + 1)}`;
}

module.exports = { replaceAt };