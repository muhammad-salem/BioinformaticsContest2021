import { appendOutput, readInfo, readInput, writeOutput } from '../read.js';

import lodash from 'lodash';
const { max, find, uniq, sortedIndexBy } = lodash;

export type Contact = { a: number, b: number, p: number };

export function solve3523Exact() {

	const input = readInput().split('\n').map(s => s.trim());

	const [n, delta] = input[0].split(' ').map(Number);
	input.splice(0, 1);

	let lastLine = 0;
	const paths: string[] = new Array(n);
	for (let i = 0; i < n; i++) {
		paths[i] = input[lastLine++];
	}

	const testCount = Number(input[lastLine++]);

	// console.log(testCount, n, delta, paths);
	writeOutput('');
	for (let i = 0; i < testCount; i++) {
		const test = input[lastLine++];
		let regExp = new RegExp(test, 'g');
		let found = testRegex(regExp, paths);
		if (found) {
			console.log('found full');
			continue;
		}
		let reg = test.substring(0, test.lastIndexOf('-') + 1);
		regExp = new RegExp(reg, 'g');
		found = testRegex(regExp, paths);
		if (found) {
			console.log('found start');
			continue;
		}

		reg = test.substring(test.indexOf('-'));
		regExp = new RegExp(reg, 'g');
		found = testRegex(regExp, paths);
		if (found) {
			console.log('found end');
			continue;
		}

		reg = test.substring(test.indexOf('-'), test.lastIndexOf('-') + 1);
		regExp = new RegExp(reg, 'g');
		found = testRegex(regExp, paths);
		if (found) {
			console.log('found between');
			continue;
		}

		console.log('not found', i);
		appendOutput(`-1 0\n`);
	}
}

function testRegex(reg: RegExp, paths: string[]) {
	for (let j = 0; j < paths.length; j++) {
		if (reg.test(paths[j])) {
			appendOutput(`${j} 1\n`);
			return true;
		}
	}
	return false;
}