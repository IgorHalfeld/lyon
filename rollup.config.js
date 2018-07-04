import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
	{
		input: 'src/Lyon.js',
		output: {
			file: pkg.browser,
			format: 'umd'
		},
		name: 'Lyon',
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**'
			})
		]
	},
	{
		input: 'src/Lyon.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
]
