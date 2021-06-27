import { appendOutput, readInfo, readInput, writeOutput } from '../read.js';

import lodash from 'lodash';
const { max, find, uniq, sortedIndexBy } = lodash;

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

		const match = searchIndex(delta, test, paths);
		console.log(match.index, match.count);

		appendOutput(`${match.index} ${match.count}\n`);
	}
}

export function searchIndex(delta: number, test: [number, number][], isoForms: [number, number][][]) {
	fullSearch:
	for (let index = 0; index < isoForms.length; index++) {
		const isoForm = isoForms[index];
		if (isoForm.length < test.length) {
			continue;
		}
		for (let x = 0; x < isoForm.length; x++) {
			if (isoForm.length - x < test.length) {
				continue fullSearch;
			}
			if (isEndInBlock(delta, test[0], isoForm[x])) {
				const count = getMatchCount(delta, test, isoForm, x);
				if (count > 0 || (count == 0 && test.length == 2)) {
					return { index, count };
				}
				continue fullSearch;
			}
		}
	}
	return { index: -1, count: 0 };;
}

export function getMatchCount(delta: number, test: [number, number][], isoForms: [number, number][], start: number) {
	if (test.length > isoForms.length - start) {
		return 0;
	}

	let matchCount = isInBlock(delta, test[0], isoForms[0]) ? 1 : 0;
	if (isInBlock(delta, test[test.length - 1], isoForms[isoForms.length - 1 - start])) {
		matchCount++;
	} else if (!isStartInBlock(delta, test[test.length - 1], isoForms[start + test.length - 1])) {
		return 0;
	}
	for (let i = 1, x = start + 1, l = test.length - 1; i < l; i++, x++) {
		if (isInBlock(delta, test[i], isoForms[x])) {
			matchCount++;
			continue;
		}
		return 0;
	}
	return matchCount;
}

export function isInBlock(delta: number, test: [number, number], isoForm: [number, number]) {

	if (test[0] == isoForm[0] && test[1] == isoForm[1]) {
		return true;
	}

	if (Math.abs(isoForm[0] - test[0]) <= delta && Math.abs(isoForm[1] - test[1]) <= delta) {
		return true;
	}
	return false;
}

export function isStartInBlock(delta: number, test: [number, number], isoForm: [number, number]) {

	if (test[0] == isoForm[0]) {
		return true;
	}

	if (Math.abs(isoForm[0] - test[0]) <= delta) {
		return true;
	}
	return false;
}

export function isEndInBlock(delta: number, test: [number, number], isoForm: [number, number]) {

	if (test[1] == isoForm[1]) {
		return true;
	}
	if (Math.abs(isoForm[1] - test[1]) <= delta) {
		return true;
	}
	return false;
}

