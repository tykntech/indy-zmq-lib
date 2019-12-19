import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import generatePackageJson from 'rollup-plugin-generate-package-json'

export default {
  input: './dist/code/index.js', // entry point
  output: {
      file: './dist/code/bundle.min.js', // output bundle file
      format: 'cjs'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      preserveSymlinks: true,
      ignore: [ 'conditional-runtime-dependency' ],
      include: /node_modules/
    }),
    generatePackageJson({
      outputFolder: 'dist',
      baseContents: (pkg) => ({
        name: pkg.name,
        main: pkg.main.replace('src', 'dist'),
        dependencies: {},
        private: true
      })
    })
  ]
}
