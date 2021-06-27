import { appendOutput, readInfo, readInput, writeOutput } from '../read.js';

import lodash from 'lodash';
const { max, min, find, uniq, sortedIndexBy } = lodash;

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

	writeOutput('');
	for (let i = 0; i < testCount; i++) {
		const test = input[lastLine++];
		let index = getIndexOf(test, paths);
		if (index >= 0) {
			console.log('found full', index, i, testCount - i);
			appendOutput(`${index} 1\n`);
			continue;
		}
		const start = test.substring(test.indexOf('-'));
		index = getIndexOf(start, paths);
		if (index >= 0) {
			console.log('found no start', index, i, testCount - i);
			appendOutput(`${index} 1\n`);
			continue;
		}

		const between = test.substring(test.indexOf('-'), test.lastIndexOf('-') + 1);
		index = getIndexOf(between, paths);
		if (index >= 0) {
			console.log('found between', index, i, testCount - i);
			appendOutput(`${index} 1\n`);
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

function pathContains(paths: string[], test: string) {
	const full = test;

	let index = getIndexOf(full, paths);
	if (index >= 0) {
		appendOutput(`${index} 1\n`);
		return true;
	}
	const start = test.substring(test.indexOf('-'));
	index = getIndexOf(start, paths);
	if (index >= 0) {
		appendOutput(`${index} 1\n`);
		return true;
	}

	const between = test.substring(test.indexOf('-'), test.lastIndexOf('-') + 1);
	index = getIndexOf(between, paths);
	if (index >= 0) {
		appendOutput(`${index} 1\n`);
		return true;
	}
	console.log('not found');
	appendOutput(`-1 0\n`);
	return false;
}

function pathIncludes(path: string, test: string) {
	if (path.includes(test)) {
		return true;
	}
	let reg = test.substring(test.indexOf('-'));
	if (path.includes(reg)) {
		return true;
	}
	reg = test.substring(test.indexOf('-'), test.lastIndexOf('-') + 1);
	if (path.includes(reg)) {
		return true;
	}
	return false;
}


function getIndexOf(test: string, paths: string[]) {
	for (let j = 0; j < paths.length; j++) {
		if (paths[j].includes(test)) {
			return j;
		}
	}
	return -1;
}