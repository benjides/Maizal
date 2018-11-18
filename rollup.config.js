const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: 'lib/maizal.js',
  output: {
    file: './dist/maizal.min.js',
    name: 'maizal',
    format: 'umd',
  },
  plugins: [commonjs(), terser()],
};
