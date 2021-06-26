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

	// console.log(testCount, n, delta, paths);
	writeOutput('');
	for (let i = 0; i < testCount; i++) {
		const test = input[lastLine++];
		// let regExp = new RegExp(test, 'g');
		// let found = testRegex(regExp, paths);
		// if (found) {
		// 	console.log('found full');
		// 	continue;
		// }
		// // let reg = test.substring(0, test.lastIndexOf('-') + 1);
		// // regExp = new RegExp(reg, 'g');
		// // found = testRegex(regExp, paths);
		// // if (found) {
		// // 	console.log('found start');
		// // 	continue;
		// // }

		// let reg = test.substring(test.indexOf('-'));
		// regExp = new RegExp(reg, 'g');
		// found = testRegex(regExp, paths);
		// if (found) {
		// 	console.log('found end');
		// 	continue;
		// }

		// reg = test.substring(test.indexOf('-'), test.lastIndexOf('-') + 1);
		// regExp = new RegExp(reg, 'g');
		// found = testRegex(regExp, paths);
		// if (found) {
		// 	console.log('found between');
		// 	continue;
		// }

		if (pathContains(paths, test)) {
			console.log('found');
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
	const start = test.substring(test.indexOf('-'));
	const between = test.substring(test.indexOf('-'), test.lastIndexOf('-') + 1);

	// const fullIndex = 0, startIndex = 0, betweenIndex = 0;


	const indexs = [getIndexOf(full, paths), getIndexOf(start, paths), getIndexOf(between, paths)].filter(n => n >= 0);

	let mn = min(indexs)!;

	console.log(indexs, mn);


	if (mn || mn >= 0) {
		appendOutput(`${mn} 1\n`);
		return true;
	}


	// for (let j = 0; j < paths.length; j++) {
	// 	if (pathIncludes(paths[j], test)) {
	// 		appendOutput(`${j} 1\n`);
	// 		return true;
	// 	}
	// }
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