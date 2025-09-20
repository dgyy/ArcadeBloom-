import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/main.js',
    format: 'umd'
  },
  watch: true,
  plugins: [
          resolve(),
          commonjs(),
          livereload(),
          serve(), 
   
  ],
  
};
