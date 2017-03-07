import nodeResolve from "rollup-plugin-node-resolve";
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  external: [ 'd3' ],
  paths: {
    d3: 'https://d3js.org/d3.v4.min.js'
  },
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