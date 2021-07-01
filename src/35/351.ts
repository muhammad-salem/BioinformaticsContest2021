import {
	appendOutput, readDataFromFile, readInfo,
	inputFile, readInput, writeOutput,
	resolveCacheFile, writeDataToFile, appendDataToFile
} from '../read.js';
import { parentPort, workerData, isMainThread, Worker } from 'worker_threads';
import { StaticPool } from 'node-worker-threads-pool';

import lodash from 'lodash';
const { min, sortBy, max, find, uniq, sortedIndexBy } = lodash;



export type Cell = { start: number; num: number, end: number; };

export type Coordinate = [Cell, Cell];
export type IsoForm = Coordinate[];



export function solve351() {
	let input: string[] | undefined = readDataFromFile(inputFile).split('\n').map(s => s.trim());
	const [n, delta] = input[0].split(' ').map(Number);
	const testCount = Number(input[n + 1]);
	input = undefined;

	const threadLimit = Math.pow(10, 3);


	const workerCount = ((testCount - (testCount % threadLimit)) / threadLimit) + ((testCount % threadLimit) > 0 ? 1 : 0);

	const staticPool = new StaticPool({
		size: 5,
		workerData: { file: inputFile },
		task: './dist/35/351.js' //workerThread
	});

	const resultFiles: { index: number; output: string; }[] = [];
	for (let index = 0; index < workerCount; index++) {
		const start = threadLimit * index;
		let limit = threadLimit * (index + 1);
		if (limit > testCount) {
			limit = testCount;
		}
		const param = { start, limit, index };
		console.log(param);
		staticPool.exec(param).then((result: { index: number, output: string }) => {
			resultFiles.push(result);
			console.log('result from thread pool:', result);
			if (resultFiles.length === workerCount) {
				const files = sortBy(resultFiles, 'index').map(r => r.output);
				console.log(files);

				writeOutput('');
				for (const file of files) {
					const data = readDataFromFile(file);
					appendOutput(data);
				}
				staticPool.destroy();
			}
		})
	}
}

if (!isMainThread) {
	console.log({ workerData });

	const input = readDataFromFile(workerData.file).split('\n').map(s => s.trim());

	const [n, delta] = input[0].split(' ').map(Number);

	let lastLine = 1;
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
	parentPort!.on('message', param => workerThread(input, isoForms, delta, lastLine, param.start, param.limit, param.index));
}

export function workerThread(input: string[], isoForms: IsoForm[], delta: number, lastLine: number, start: number, limit: number, index: number) {

	lastLine += start;
	const output = resolveCacheFile('easy-' + index + '.txt');

	writeDataToFile(output, '');
	testLoop:
	for (let i = start; i < limit; i++) {
		const test = input[lastLine++].split(',').map(s => s.split('-').map(Number)) as [number, number][];

		const match = findBestMath(delta, test, isoForms);
		// console.log(i, testCount - i, match.index, match.count);

		appendDataToFile(output, `${match.index} ${match.count}\n`);
	}
	parentPort?.postMessage({ index, output });
	// return { index, output };
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

