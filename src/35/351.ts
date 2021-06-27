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
		console.log(match, i, testCount - i);

		appendOutput(`${match.index} ${match.count}\n`);
	}
}

export function searchIndex(delta: number, test: [number, number][], isoForms: [number, number][][]) {
	fullSearch:
	for (let index = 0; index < isoForms.length; index++) {
		const isoForm = isoForms[index];
		for (let x = 0; x < isoForm.length; x++) {
			if (isInBlock(delta, test[0], isoForm[x])) {
				const count = getMatchCount(delta, test, isoForm, x);
				if (count > 0) {
					return { index, count };
				}
				continue fullSearch;
			}
		}
	}
	anySearch:
	for (let index = 0; index < isoForms.length; index++) {
		const isoForm = isoForms[index];
		for (let x = 0; x < isoForm.length; x++) {
			if (isEndInBlock(delta, test[0], isoForm[x])) {
				const count = getMatchCount(delta, test, isoForm, x);
				if (count > 0 || (count == 0 && test.length == 2)) {
					return { index, count };
				}
				continue anySearch;
			}
		}
	}
	return { index: -1, count: 0 };;
}

export function getMatchCount(delta: number, test: [number, number][], isoForms: [number, number][], start: number) {
	if (test.length > isoForms.length - start) {
		return 0;
	}
	let matchCount = 0;
	for (let i = 0, x = start; i < test.length; i++, x++) {
		const testBlock = test[i];
		const isoBlock = isoForms[x];
		if (i == 0) {
			if (isInBlock(delta, testBlock, isoBlock)) {
				matchCount++;
				continue;
			}
			if (isEndInBlock(delta, testBlock, isoBlock)) {
				continue;
			}
			return 0;
		} else if (i < test.length - 1) {
			if (isInBlock(delta, testBlock, isoBlock)) {
				matchCount++;
				continue;
			}
			return 0;
		} else if (i == test.length - 1) {
			if (isInBlock(delta, testBlock, isoBlock)) {
				matchCount++;
				break;
			}
			if (isStartInBlock(delta, testBlock, isoBlock)) {
				break;
			}
			return 0;
		}
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

