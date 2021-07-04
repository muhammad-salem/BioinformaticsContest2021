import {
	appendOutput, readDataFromFile, inputFile, writeOutput,
	resolveCacheFile, writeDataToFile, appendDataToFile, readLines, problemName
} from '../read.js';
import { parentPort, workerData, isMainThread } from 'worker_threads';
import { StaticPool } from 'node-worker-threads-pool';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

import lodash from 'lodash';
const { min, minBy, maxBy, sortBy } = lodash;



// export type Cell = { start: number; num: number, end: number; };
// export type Coordinate = [Cell, Cell];
export type Coordinate = [number, number];
export type IsoForm = Coordinate[];
// export type IsoFormInfo = { index: number; isoForm: IsoForm; length: number, delta: number, maxCoverLength: number; };
export type IsoFormInfo = { index: number; isoForm: IsoForm; delta: number; };


export function solve353ExactHardSimilar() {
	const cacheInput = resolveCacheFile(problemName + '-sorted-input.txt');
	let testCount = 0;
	let input: string[] | undefined = readLines(inputFile);
	const [n, delta] = input[0].split(' ').map(Number);
	if (existsSync(cacheInput)) {
		testCount = Number(input[n + 1]);
	} else {
		const isoForms: { start: number, line: string }[] = new Array(n);
		let lastLine = 1;
		for (let i = 0; i < n; i++) {
			const line = input[lastLine++];
			const start = +line.substring(0, line.indexOf('-'));
			isoForms[i] = { start, line };
		}
		let newInput = isoForms.map((form, index) => ({ form, index }));
		newInput = sortBy(newInput, ni => ni.form.start);
		if (!existsSync(resolve(cacheInput, '..'))) {
			mkdirSync(resolve(cacheInput, '..'));
		}
		writeDataToFile(cacheInput, input[0]);
		for (const ni of newInput) {
			appendDataToFile(cacheInput, `\n${ni.index} `);
			appendDataToFile(cacheInput, ni.form.line);
		}
		appendDataToFile(cacheInput, '\n' + input[lastLine] + '\n');
		testCount = Number(input[lastLine++]);
		for (let i = 0; i < testCount; i++) {
			appendDataToFile(cacheInput, input[lastLine++]);
			appendDataToFile(cacheInput, '\n');
		}
		input = undefined;
		newInput = undefined as any;
	}

	const threadLimit = Math.pow(10, 3);
	const workerCount = ((testCount - (testCount % threadLimit)) / threadLimit) + ((testCount % threadLimit) > 0 ? 1 : 0);

	const staticPool = new StaticPool({
		size: 5,
		workerData: { file: cacheInput, problemName },
		task: './dist/35/353-hard-similar.js' //workerThread
	});

	const resultFiles: { index: number; output: string; }[] = [];
	for (let index = 0; index < workerCount; index++) {
		const start = threadLimit * index;
		let limit = threadLimit * (index + 1);
		if (limit > testCount) {
			limit = testCount;
		}
		const param = { start, limit, index };
		// console.log(threadId, param);
		staticPool.exec(param).then((result: { index: number, output: string }) => {
			resultFiles.push(result);
			console.log('finish', resultFiles.length, 'of', workerCount, '==>', result.index, result.output);
			if (resultFiles.length === workerCount) {
				const files = sortBy(resultFiles, 'index').map(r => r.output);
				console.log('concat files', files.length);
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
	const input = readDataFromFile(workerData.file).split('\n').map(s => s.trim());

	const [n, IgnoredDelta] = input[0].split(' ').map(Number);

	let lastLine = 1;
	const isoForms: IsoFormInfo[] = new Array(n);
	for (let i = 0; i < n; i++) {
		const lines = input[lastLine++].split(' ');
		const index = +lines[0];

		const firstCoordinate = lines[1].substring(0, lines[1].indexOf(',')).split('-').map(Number);
		// const length = firstCoordinate[1] - firstCoordinate[0];
		// const delta = ((length - (length % 2)) / 2) - 1 + ((length % 2) > 0 ? 1 : 10);
		const isoForm = lines[1]
			.split(',')
			.map(s => s
				.split('-')
				.map(Number) as Coordinate
				// .map(m => ({ start: m - delta, num: m, end: m + delta })) as Coordinate
			);

		const deltaCo = maxBy(isoForm, co => co[1] - co[0])!;
		const delta = deltaCo[1] - deltaCo[0];


		isoForms[i] = { index, isoForm, delta };
	}
	const testCount = Number(input[lastLine++]);
	// console.log(threadId, n, isoForms.length, testCount);

	const cacheName = (workerData.problemName as string).split('/')[1];

	parentPort!.on('message', param => workerThread(input, isoForms, lastLine + param.start, param.start, param.limit, param.index, cacheName));
}


export function workerThread(input: string[], isoForms: IsoFormInfo[], lastLine: number, start: number, limit: number, index: number, name: string) {
	const output = resolveCacheFile(name + '-' + index + '.txt');
	writeDataToFile(output, '');
	testLoop:
	for (let i = start; i < limit; i++) {
		const test = input[lastLine++].split(',').map(s => s.split('-').map(Number)) as [number, number][];

		const match = findBestMatch(test, isoForms);
		// console.log(i, testCount - i, match.index, match.count);
		// console.log(match.index, match.count);

		appendDataToFile(output, `${match}\n`);
	}
	parentPort?.postMessage({ index, output });
}

export function findBestMatch(test: [number, number][], isoForms: IsoFormInfo[]): number {
	if (test.length == 0) {
		return -1;
	}
	let matches: { count: number, isoForm: IsoFormInfo }[] = [];
	fullSearch:
	for (let index = 0; index < isoForms.length; index++) {
		const isoFormInfo = isoForms[index];
		if (isoFormInfo.isoForm.length < test.length) {
			continue;
		}
		for (let x = 0; x < isoFormInfo.isoForm.length; x++) {
			if (isoFormInfo.isoForm.length - x < test.length) {
				continue fullSearch;
			}
			if (isReadApplySimilarity(test[0], isoFormInfo.isoForm[x])) {
				const count = getReadMatchCount(test, isoFormInfo.isoForm, x);
				if (count > 0) {
					matches.push({ count, isoForm: isoFormInfo });
				}
				continue fullSearch;
			}
		}
	}
	if (matches.length === 0) {
		// return -1;
		return findBestMatch(test.slice(1), isoForms);
	}
	const best = maxBy(matches, m => m.count)!;
	const allBestIsoForms = matches.filter(m => m.count == best.count).map(m => m.isoForm);
	const minDelta = minBy(allBestIsoForms, f => f.delta)!;
	const allMinDeltaMaxCount = allBestIsoForms.filter(f => f.delta == minDelta.delta).map(m => m.index);

	// const allMinDeltaMaxCount = allBestIsoForms.map(m => m.index);
	return min(allMinDeltaMaxCount)!;
}

export function getReadMatchCount(test: [number, number][], isoForm: IsoForm, start: number) {
	let count = 0;
	for (let i = 0, x = start, l = test.length; i < l; i++, x++) {
		if (isReadApplySimilarity(test[i], isoForm[x])) {
			count++;
		} else {
			return -1;
		}
	}
	return count;
}


const twoBy3 = 2 / 3;
const oneBy3 = 1 / 3;

export function isReadApplySimilarity(test: [number, number], isoForm: Coordinate) {
	const testLength = test[1] - test[0];
	// const exonLength = getCoveredExonLength(test, isoForm);
	const intronLength = getCoveredIntronLength(test, isoForm);
	// if ((exonLength / testLength) > twoBy3) {
	// 	return false;
	// }
	if ((intronLength / testLength) > oneBy3) {
		return false;
	}
	return true;
}

export function getCoveredExonLength(test: [number, number], isoForm: Coordinate) {
	if (test[0] >= isoForm[0]) {
		if (test[1] <= isoForm[1]) {
			return test[1] - test[0];
		}
		return isoForm[1] - test[0];
	}
	if (test[1] <= isoForm[1]) {
		return test[1] - isoForm[0];
	}
	return isoForm[1] - isoForm[0];
}

export function getCoveredIntronLength(test: [number, number], isoForm: Coordinate) {
	if (test[0] < isoForm[0] && test[1] > isoForm[1]) {
		return (isoForm[0] - test[0]) + (test[1] - isoForm[1]);
	} else if (test[0] < isoForm[0]) {
		return isoForm[0] - test[0];
	} else if (test[1] > isoForm[1]) {
		return test[1] - isoForm[1];
	}
	return 0;
}
