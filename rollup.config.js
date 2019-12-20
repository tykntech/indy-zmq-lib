import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import generatePackageJson from '@rollup/plugin-json';
import rollupGitVersion from 'rollup-plugin-git-version';

export default {
  input: './dist/code/index.js', // entry point
  output: {
    file: './dist/code/bundle.min.js', // output bundle file
    format: 'cjs'
  },
  plugins: [
    resolve({
      mainFields: ['main', 'jsnext']
    }),
    commonjs({
      preserveSymlinks: true,
      ignore: ['conditional-runtime-dependency'],
      include: /node_modules/
    }),
    generatePackageJson({
      outputFolder: 'dist',
      baseContents: pkg => ({
        name: pkg.name,
        main: pkg.main.replace('src', 'dist'),
        dependencies: {},
        private: true
      })
    }),
    rollupGitVersion()
  ]
};
