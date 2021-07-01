import { appendOutput, readInfo, readInput, writeOutput } from '../read.js';

import lodash from 'lodash';
import { type } from 'os';
const { min, max, find, uniq, sortedIndexBy } = lodash;


export type Cell = { start: number; num: number, end: number; };

export type Coordinate = [Cell, Cell];
export type IsoForm = Coordinate[];


export function solve351() {

	const input = readInput().split('\n').map(s => s.trim());

	const [n, delta] = input[0].split(' ').map(Number);
	input.splice(0, 1);

	let lastLine = 0;
	const isoForms: IsoForm[] = new Array(n);
	for (let i = 0; i < n; i++) {
		isoForms[i] = input[lastLine++]
			.split(',')
			.map(s => s
				.split('-')
				.map(Number)
				.map(m => ({ start: m - delta, num: m, end: m + delta })) as Coordinate
			);
	}

	const testCount = Number(input[lastLine++]);

	writeOutput('');
	testLoop:
	for (let i = 0; i < testCount; i++) {
		const test = input[lastLine++].split(',').map(s => s.split('-').map(Number)) as [number, number][];

		const match = findBestMath(delta, test, isoForms);
		console.log(i, testCount - i, match.index, match.count);

		appendOutput(`${match.index} ${match.count}\n`);
	}
}

export function findBestMath(delta: number, test: [number, number][], isoForms: IsoForm[]) {
	const matches: number[] = [];
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
			if (isReadMatchIsoFormByDelta(test[0], isoForm[x])) {
				if (isReadMatchIsoForm(delta, test, isoForm, x)) {
					// if (delta == 0) {
					// 	return { index, count: 1 };
					// }
					matches.push(index);
				}
				continue fullSearch;
			}
		}
	}
	if (matches.length === 0) {
		return { index: -1, count: 0 };
	}
	return { index: min(matches), count: matches.length };
}

export function isReadMatchIsoForm(delta: number, test: [number, number][], isoForm: IsoForm, start: number) {
	for (let i = 1, x = start + 1, l = test.length - 1; i < l; i++, x++) {
		if (!isInBlockNoDelta(test[i], isoForm[x])) {
			return false;
		}
	}
	const lastTest = test[test.length - 1], lastIsoForm = isoForm[start + test.length - 1];
	if (Math.abs(lastTest[0] - lastIsoForm[0].num) <= delta) {
		if (lastTest[1] <= (lastIsoForm[1].num + delta)) {
			return true;
		}
	}
	return false;
}

export function isReadMatchIsoFormByDelta(test: [number, number], isoForm: Coordinate) {
	return test[0] >= isoForm[0].start && inRangeOfCellEnd(test, isoForm);
}

export function isInBlockNoDelta(test: [number, number], isoForm: Coordinate) {
	return inRangeOfCellStart(test, isoForm) && inRangeOfCellEnd(test, isoForm);
}

export function inRangeOfCellStart(test: [number, number], isoForm: Coordinate) {
	return test[0] >= isoForm[0].start && test[0] <= isoForm[0].end;
}

export function inRangeOfCellEnd(test: [number, number], isoForm: Coordinate) {
	return test[1] >= isoForm[1].start && test[1] <= isoForm[1].end;
}

