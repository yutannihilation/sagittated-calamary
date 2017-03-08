import nodeResolve from "rollup-plugin-node-resolve";
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'es',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  dest: 'docs/bundle.js'
};