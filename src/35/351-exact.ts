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
	testLoop:
	for (let i = 0; i < testCount; i++) {
		const test = input[lastLine++];
		const regExp = new RegExp(test, 'g');
		inner:
		for (let i = 0; i < paths.length; i++) {
			const path = paths[i];

			let regexArray = regExp.exec(path);
			if (regexArray) {
				const length = test.split(',').length;
				appendOutput(`${(i > 0) ? '\n' : ''}${i} ${length}`);
				break inner;
			}
			appendOutput(`${(i > 0) ? '\n' : ''}-1 0`);
		}
	}
}

export function findFirstMatch(index: number, delta: number, tests: [number, number][], isoForms: [number, number][][]) {
	for (; index < isoForms.length; index++) {
		const isoForm = isoForms[index];
		if (isoForm.length < tests.length) {
			continue;
		}
		if (isEndMatching(delta, tests[0], isoForm[0]) && isStartMatching(delta, tests[1], isoForm[1])) {
			return { index, start: 0, isoForm };
		}
		// if (tests[0][0] > isoForm[0][1]) {
		// 	const start = sortedIndexBy(isoForm, tests[0], a => isStartMatching(delta, tests[0], a));
		// 	if (start < isoForm.length && start > 0) {
		// 		return { index, start, isoForm };
		// 	}
		// }
	}
	return { index };
}

export function isConnectMatch(delta: number, tests: [number, number][], isoForms: [number, number][], testStart: number, isoStart: number) {
	for (let i = testStart; i < tests.length; i++) {
		if (!(isEndMatching(delta, tests[i], isoForms[isoStart + i]) && isStartMatching(delta, tests[i + 1], isoForms[isoStart + i]))) {
			return false;
		}
	}
	return true;
}


export function isStartMatching(delta: number, test: [number, number], isoForm: [number, number]) {
	return isMatching(0, delta, test, isoForm);
}

export function isEndMatching(delta: number, test: [number, number], isoForm: [number, number]) {
	return isMatching(1, delta, test, isoForm);
}

export function isFullMatching(delta: number, test: [number, number], isoForm: [number, number]) {
	return isMatching(0, delta, test, isoForm) && isMatching(1, delta, test, isoForm);
}

export function isNotFullMatching(delta: number, test: [number, number], isoForm: [number, number]) {
	return !isMatching(0, delta, test, isoForm) || !isMatching(1, delta, test, isoForm);
}

export function isMatching(index: number, delta: number, test: [number, number], isoForm: [number, number]) {
	if (test[index] == isoForm[index]) {
		return true;
	}
	// can correct the error
	else if (Math.abs(isoForm[index] - test[index]) <= delta) {
		return true;
	}
	return false;
}
