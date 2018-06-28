import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
	{
		input: 'src/emilly.js',
		output: {
			file: pkg.browser,
			format: 'umd'
		},
		name: 'Emilly',
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**'
			})
		]
	},
	{
		input: 'src/emilly.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
]
