import { appendOutput, readInfo, readInput, writeOutput } from '../read.js';

import lodash from 'lodash';
const { max, find, uniq } = lodash;

export type Contact = { a: number, b: number, p: number };

export function solve351() {

	const input = readInput().split('\n').map(s => s.trim());

	const [n, delta] = input[0].split(' ').map(Number);
	input.splice(0, 1);

	let lastLine = 0;
	const paths: [number, number][][] = new Array(n);
	for (let i = 0; i < n; i++) {
		paths[i] = input[lastLine++].split(',').map(s => s.split('-').map(Number)) as [number, number][];
	}

	const testCount = Number(input[lastLine++]);

	// console.log(testCount, n, delta, paths);
	writeOutput('');
	testLoop:
	for (let i = 0; i < testCount; i++) {
		const test = input[lastLine++].split(',').map(s => s.split('-').map(Number)) as [number, number][];

		let index = -1;

		do {
			const match = findFirstMatch(++index, delta, test, paths);
			if (match.index === -1) {
				appendOutput('-1 0\n');
				continue testLoop;
			}
			index = match.index;
			const isoForm = match.isoForm!;
			let matchCount = isFullMatching(delta, test[0], isoForm[0]) ? 1 : 0;

			for (let j = 1; j < test.length; j++) {
				const isFull = isFullMatching(delta, test[j], isoForm[j]);
				isFull ? matchCount++ : void 0;
			}
			appendOutput(`${index} ${matchCount}\n`);
			continue testLoop;
		} while (index <= paths.length);
	}
}

export function findFirstMatch(index: number, delta: number, tests: [number, number][], isoForms: [number, number][][]) {
	for (; index < isoForms.length; index++) {
		const isoForm = isoForms[index];
		if (isEndMatching(delta, tests[0], isoForm[0]) && isStartMatching(delta, tests[1], isoForm[1])) {
			return { index, isoForm };
		}
	}
	return { index: -1 };
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

export function isMatching(index: number, delta: number, test: [number, number], isoForm: [number, number]) {
	if (test[index] == isoForm[index]) {
		return true;
	}
	else if (Math.abs(test[index] - isoForm[index]) <= delta) {
		return true;
	}
	return false;
}
