import { createReadStream } from 'fs';
import { cacheFile, readInfo, writeOutput } from './read.js';
import * as readline from 'readline';
import lodash from 'lodash';
const { sortedIndexBy, sortBy } = lodash;
// import { sortedIndexBy } from 'lodash';

import {
	Worker, isMainThread, parentPort, workerData
} from 'worker_threads';


export type SumType = { mi: number, ki: number, sum: number };

function findSmallDelta(sumArray: SumType[], signal: number, i: number, len = sumArray.length): SumType {
	var last = sumArray[i || 0];
	var lastDelta = Math.abs(last.sum - signal);
	if (lastDelta === 0) {
		return last;
	}
	for (; i < len; i++) {
		var current = sumArray[i];
		var currentDelta = Math.abs(current.sum - signal);
		if (lastDelta < currentDelta) {
			return last
		}
		if (currentDelta === 0) {
			return current;
		}
		last = current;
		lastDelta = currentDelta;
	}
	// not reachable
	return last;
}

// A recursive binary search function. It returns
// location of x in given array arr[l..r] is present,
// otherwise -1
export function binarySearch(sumArray: SumType[], start: number, limit: number, signal: number): SumType {
	if (limit == start) {
		return sumArray[start];
	}
	if (limit - start <= 100) {
		return findSmallDelta(sumArray, signal, start, limit);
	}
	if (limit > start) {
		let mid = start + Math.floor((limit - start) / 2);

		// If the element is present at the middle
		// itself
		console.log(start, limit, signal, sumArray[start], sumArray[limit]);
		if (sumArray[mid].sum == signal) {
			return sumArray[mid];
		}

		// If element is smaller than mid, then
		// it can only be present in left subarray
		if (sumArray[mid].sum > signal) {
			return binarySearch(sumArray, start, mid + 1, signal);
		}

		// Else the element can only be present
		// in right subarray
		return binarySearch(sumArray, mid, limit, signal);
	}
	return findSmallDelta(sumArray, signal, start, limit);

	// // We reach here when element is not
	// // present in array

	// return;
}


// Returns position of first
// occurrence of x in array
export function exponentialSearch(sumArray: SumType[], length: number, signal: number) {

	// If x is present at
	// first location itself
	if (sumArray[0].sum == signal)
		return sumArray[0];

	// Find range for binary search
	// by repeated doubling
	let i = 1;
	while (i < length && sumArray[i].sum <= signal) {
		i = i * 2;
	}
	// Call binary search for
	// the found range.
	return binarySearch(sumArray, i / 2, Math.min(i, length - 1), signal);
}



function findSmallDeltaAndDoSum(ms: number[], ks: number[]) {
	let mi = 0, ki = 0;
	let msl = ms.length, ksl = ks.length;
	var sum: SumType[] = [];
	var lastIndex = -1;

	function findSum(signal: number, ni: number) {
		for (; mi < msl; mi++) {
			var m = ms[mi];
			for (; ki < ksl; ki++) {
				console.log('%s => sum %s: %s', ni, mi, ki);
				const result = m + ks[ki];
				if (result > 0) {
					const sumType = { mi: mi + 1, ki: ki + 1, sum: result };
					lastIndex = sum.push(sumType);
					if (result === signal) {
						return sumType;
					}
				}
			}
			ki = 0;
		}
		sum.sort((a, b) => a.sum - b.sum);
	}

	function searchSignal(signal: number, ni: number) {
		let value: SumType | undefined;
		if (mi === msl) {
			// return findSmallDelta(sum, signal);
			return binarySearch(sum, 0, sum.length - 1, signal)!;
		}
		if (mi === 0 || ki == 0) {
			value = findSum(signal, ni);
			if (value) {
				return value;
			}
		}
		if (lastIndex < sum.length) {
			const slice = sum.slice(0, lastIndex);
			// value = findSmallDelta(sum, signal);
			value = binarySearch(sum, 0, sum.length - 1, signal);
			if (value) {
				return value;
			}
		}
		value = findSum(signal, ni);
		if (value) {
			return value;
		}
		// should be ini sum array
		// return findSmallDelta(sum, signal);
		return binarySearch(sum, 0, sum.length - 1, signal)!;
	}

	return searchSignal;
}

// export default function startD() {
// 	// console.log(readInput());
// 	const { count, lines } = readInfo();
// 	let data = '';
// 	for (let i = 0, j = 0; i < count; i++, j = i * 4) {
// 		const [M, K, N] = lines[j].split(' ').map(Number);

// 		const ms = lines[j + 1].split(' ').map(Number);
// 		const ks = lines[j + 2].split(' ').map(Number);
// 		const ns = lines[j + 3].split(' ').map(Number);

// 		console.log(M, K, N, ms, ks, ns);

// 		let searchSignal = findSmallDeltaAndDoSum(ms, ks);

// 		let result: SumType[] = ns.map((n, ni) => {
// 			console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
// 			return searchSignal(n, ni);
// 		});

// 		console.log({ result });

// 		data += result.map(r => `${r.mi} ${r.ki}`).join('\n');

// 		data += '\n';
// 	}
// 	console.log(data);
// 	writeOutput(data);
// }

// export function multiSort(arrays: SumType[]) {
// 	const temps: SumType[] = new Array(arrays.length);
// 	for (let i = 0; i < arrays.length; i++) {
// 		const element = arrays[i];

// 	}
// }

export const ARRAY_LIMIT = Math.pow(2, 26) - 1;

// export const TEMP_ARRAY: SumType[][];

export class MultiArray {

	private arrays: SumType[][] = [];
	private selectedArray = 0;
	private lastIndex = 0;

	constructor() {
		this.arrays.push(new Array(ARRAY_LIMIT));
	}

	private addNewArray() {
		this.arrays[this.selectedArray].splice(this.lastIndex);
		this.arrays.push(new Array(ARRAY_LIMIT));
		this.selectedArray++;
		this.lastIndex = 0;
	}

	push(info: SumType) {
		if (this.lastIndex % 250 == 0) {
			console.log({
				lastIndex: this.lastIndex,
				selectedArray: this.selectedArray,
				len: this.arrays[this.selectedArray].length,
				al: this.arrays.length
			});
		}
		this.arrays[this.selectedArray][this.lastIndex++] = info;
		if (this.lastIndex >= ARRAY_LIMIT) {
			this.addNewArray();
		}
	}

	getAll() {
		return this.arrays.shift()!;
	}

	sort(callback: Function) {
		let count = 0;
		for (let i = 0; i < this.arrays.length; i++) {
			console.log('sort: ', i);
			const worker = new Worker('./dist/sort.js', { workerData: { array: this.arrays[i] } });
			worker.on('message', data => {
				console.log('data', data);
				if (data === 'done') {
					count++;
					console.log('=sort= done:', i, ', rem:', this.arrays.length - i - 1);
					if (count === this.arrays.length) {
						callback();
					}
				}
			});
			console.log('init worker', i, ': done');
		}
	}

	searchIn(signal: number, arrayIndex: number): SumType[] {
		const temp: SumType = { mi: 0, ki: 0, sum: signal };
		var sum = this.arrays[arrayIndex];
		const index = sortedIndexBy(sum, temp, 'sum');
		if (index === 0) {
			return [sum[0]];
		}
		if (index === sum.length) {
			return [sum[sum.length - 1]];
		}
		const before = sum[index - 1];
		const after = sum[index];
		return [before, after];
	}

	findIn(sum: SumType[], n: number) {
		console.log('== search', n);
		const temp: SumType = { mi: 0, ki: 0, sum: n };
		const index = sortedIndexBy(sum, temp, 'sum');
		if (index === 0) {
			return sum[0];
		}
		if (index === sum.length) {
			return sum[sum.length - 1];
		}
		const before = sum[index - 1];
		const beforeDelta = Math.abs(n - before.sum);
		if (beforeDelta == 0) {
			return before;
		}
		const after = sum[index];
		if (!after) {
			return before;
		}
		const afterDelta = Math.abs(after.sum - n);
		if (afterDelta == 0) {
			return after;
		}
		if (beforeDelta === afterDelta) {
			return before;
		} else if (beforeDelta < afterDelta) {
			return before;
		} else {
			return after;
		}
	}

	find(signal: number): SumType {
		const toSearch: SumType[] = new Array(this.arrays.length * 2);
		let l = 0;
		for (let i = 0; i < this.arrays.length; i++) {
			const r = this.searchIn(signal, i);
			r.forEach(d => toSearch[l++] = d);
		}
		toSearch.splice(l);
		return this.findIn(toSearch, signal);
	}

}


export default function startD() {
	const { count, lines } = readInfo();
	let data = '';
	for (let i = 0, j = 0; i < count; i++, j = i * 4) {
		const [M, K, N] = lines[j].split(' ').map(Number);

		var ms = lines[j + 1].split(' ').map(Number);
		var ks = lines[j + 2].split(' ').map(Number);
		var ns = lines[j + 3].split(' ').map(Number);

		console.log({ M, K, N });


		const results: SumType[][] = [];
		const total = ms.length * ks.length;
		let range: number, max: number;
		if (total > ARRAY_LIMIT) {
			range = +(ms.length / 10).toFixed(0);
			max = ms.length % 10 > 0 ? 11 : 10;
		} else {
			range = ms.length;
			max = 1;
		}

		for (let z = 0; z < max; z++) {
			const start = range * z;
			const end = range * (z + 1);
			const limit = end >= ms.length ? ms.length : end;

			console.log({ max, range, start, limit });

			const multiArray = new MultiArray();

			for (var mi = start, msl = limit; mi < msl; mi++) {
				for (var ki = 0, ksl = ks.length; ki < ksl; ki++) {
					if (ki % 250 == 0) {
						console.log('sum %s => m[%s, %s, %s] : k[%s, %s, %s]', i, mi, msl, msl - mi - 1, ki, ksl, ksl - ki - 1);
					}
					var add = ms[mi] + ks[ki];
					if (add > 0) {
						multiArray.push({ mi: mi + 1, ki: ki + 1, sum: add });
					}
				}
			}

			multiArray.sort(() => {
				let result: SumType[] = ns.map((n, ni) => {
					console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
					return multiArray.find(n);
				});

				console.log({ result });

				results.push(result);
				if (z === max - 1) {
					const nSum = new MultiArray();
					const final = ns.map((n, ni) => {
						const temp: SumType[] = new Array(max);
						for (let z = 0; z < max; z++) {
							temp[z] = results[z][ni];
						}
						temp.sort((a, b) => a.sum - b.sum);
						console.log({ temp });

						return nSum.findIn(temp, n);
					});
					data += final.map(r => `${r.mi} ${r.ki}`).join('\n');
					data += '\n';

					if (i === count - 1) {
						console.log(data);
						writeOutput(data);
					}
				}

			});
		}

		// const nSum = new MultiArray();
		// const final = ns.map((n, ni) => {
		// 	const temp: SumType[] = new Array(max);
		// 	for (let z = 0; z < max; z++) {
		// 		temp[z] = results[z][ni];
		// 	}
		// 	temp.sort((a, b) => a.sum - b.sum);
		// 	return nSum.findIn(temp, n);
		// });

		// var nSum = new NewArray(ms.length * ks.length);
		// var selectedArray = 0;

		// for (var mi = 0, msl = ms.length; mi < msl; mi++) {
		// 	for (var ki = 0, ksl = ks.length; ki < ksl; ki++) {
		// 		if (ki % 250 == 0) {
		// 			console.log('sum %s => m[%s, %s] : k[%s, %s] ==> %s', i, mi, msl - mi, ki, ksl - ki, lastIndex);
		// 		}
		// 		var add = ms[mi] + ks[ki];
		// 		// if (mi >= 26100) {
		// 		// 	console.log({ lastIndex });
		// 		// }
		// 		if (add > 0) {
		// 			nSum.push(lastIndex++, { mi: mi + 1, ki: ki + 1, sum: add });
		// 			// sum[lastIndex++] = { mi: mi + 1, ki: ki + 1, sum: add };
		// 		}
		// 		if (lastIndex >= limit) {
		// 			lastIndex = 0;
		// 			nSum.setSelectedArray(++selectedArray);
		// 		}
		// 	}
		// }
		// // var sum = nSum.getAll();
		// nSum.sort();

		// // sum.splice(lastIndex);
		// // sum.sort((a, b) => a.sum - b.sum);
		// // console.log({ sum });

		// // var temp = { sum: 0, mi: 0, ki: 0 };
		// let result: SumType[] = ns.map((n, ni) => {
		// 	console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
		// 	return nSum.find(n);
		// });

		// console.log({ result });

		// data += final.map(r => `${r.mi} ${r.ki}`).join('\n');

		// data += '\n';
	}
	// console.log(data);
	// writeOutput(data);
}

// export default function startD() {
// 	// console.log(readInput());
// 	const { count, lines } = readInfo();
// 	let data = '';
// 	for (let i = 0, j = 0; i < count; i++, j = i * 4) {
// 		const [M, K, N] = lines[j].split(' ').map(Number);

// 		const ms = lines[j + 1].split(' ').map(Number);
// 		const ks = lines[j + 2].split(' ').map(Number);
// 		const ns = lines[j + 3].split(' ').map(Number);

// 		console.log(M, K, N, ms, ks, ns);

// 		var sum: SumType[] = new Array(ms.length * ks.length);
// 		var lastIndex = 0;
// 		for (var mi = 0, msl = ms.length; mi < msl; mi++) {
// 			var m = ms[mi];
// 			for (var ki = 0, ksl = ks.length; ki < ksl; ki++) {
// 				console.log('sum %s => %s: %s', i, mi, ki);
// 				const result = m + ks[ki];
// 				if (result > 0) {
// 					const sumType = { mi: mi + 1, ki: ki + 1, sum: result };
// 					sum[lastIndex++] = sumType;
// 				}
// 			}
// 		}
// 		sum = sum.slice(0, lastIndex);
// 		sum.sort((a, b) => a.sum - b.sum);
// 		console.log({ sum });

// 		let result: SumType[] = ns.map((n, ni) => {
// 			console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
// 			return findSmallDelta(sum, n);
// 		});

// 		// let result: SumType[] = ns.map((n, ni) => {
// 		// 	console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);

// 		// 	const signal = { mi: 0, ki: 0, sum: n };
// 		// 	sum.unshift(signal);
// 		// 	sum.sort((a, b) => a.sum - b.sum);

// 		// 	const signalIndex = sum.indexOf(signal);
// 		// 	if (signalIndex === 0) {
// 		// 		sum.splice(signalIndex, 1);
// 		// 		return sum[1];
// 		// 	}
// 		// 	if (signalIndex === sum.length - 1) {
// 		// 		sum.splice(signalIndex, 1);
// 		// 		return sum[sum.length - 2];
// 		// 	}
// 		// 	const before = sum[signalIndex - 1];

// 		// 	const after = sum[signalIndex + 1];
// 		// 	sum.splice(signalIndex, 1);

// 		// 	const beforeDelta = Math.abs(signal.sum - before.sum);
// 		// 	if (beforeDelta === 0) {
// 		// 		return before;
// 		// 	}

// 		// 	if (before.sum <= 0) {
// 		// 		return after;
// 		// 	}

// 		// 	const afterDelta = Math.abs(after.sum - signal.sum);
// 		// 	console.log({ signal, before, after, beforeDelta, afterDelta });

// 		// 	if (beforeDelta === afterDelta) {
// 		// 		if (before.mi <= after.mi) {
// 		// 			return before;
// 		// 		}
// 		// 		return after;
// 		// 	} else if (beforeDelta < afterDelta) {
// 		// 		return before;
// 		// 	} else {
// 		// 		return after;
// 		// 	}
// 		// });

// 		console.log({ result });

// 		data += result.map(r => `${r.mi} ${r.ki}`).join('\n');

// 		data += '\n';
// 	}
// 	console.log(data);
// 	writeOutput(data);
// }

function sortedPush(array: SumType[], value: SumType) {
	array.splice(sortedIndexBy(array, value, st => st.sum), 0, value);
}

export function processD() {
	const readStream = createReadStream(cacheFile, { encoding: 'utf8' });

	const rl = readline.createInterface({
		input: readStream,
		output: process.stdout,
		terminal: false
	});
	const sum: SumType[] = [];
	rl.on('line', (line) => {
		const arr = line.split(' ').map(Number);
		sortedPush(sum, { mi: arr[0], ki: arr[1], sum: arr[2] });
		// sum.push({ mi: arr[0], ki: arr[1], sum: arr[2] });
		if (sum.length % 250 == 0) {
			console.log(line);
		}
	});

	rl.on('pause', () => {
		console.log('read file: done');
		// _.sortBy(sum, st => st.sum);
		// sum.sort((a, b) => a.sum - b.sum);
		// console.log('sorting: done');


		const { count, lines } = readInfo();
		let data = '';
		for (let i = 0, j = 0; i < count; i++, j = i * 4) {
			const [M, K, N] = lines[j].split(' ').map(Number);

			const ms = lines[j + 1].split(' ').map(Number);
			const ks = lines[j + 2].split(' ').map(Number);
			const ns = lines[j + 3].split(' ').map(Number);

			console.log(M, K, N, ms, ks, ns);
			// openCacheFile();

			// sum.sort((a, b) => a.sum - b.sum);
			console.log({ sum });

			let result: SumType[] = ns.map((n, ni) => {
				console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
				return exponentialSearch(sum, sum.length, n);
			});

			console.log({ result });

			data += result.map(r => `${r.mi} ${r.ki}`).join('\n');

			data += '\n';
		}
		console.log(data);
		writeOutput(data);
	});
}
