// import { createReadStream } from 'fs';
// import { cacheFile, readInfo, writeOutput } from './read.js';
// import * as readline from 'readline';



// export default function startD4() {
// 	const { count, lines } = readInfo();
// 	let data = '';
// 	for (let i = 0, j = 0; i < count; i++, j = i * 4) {
// 		const [M, K, N] = lines[j].split(' ').map(Number);

// 		var ms = lines[j + 1].split(' ').map(Number);
// 		var ks = lines[j + 2].split(' ').map(Number);
// 		var ns = lines[j + 3].split(' ').map(Number);

// 		console.log({ M, K, N });


// 		const results: SumType[][] = [];
// 		const total = ms.length * ks.length;
// 		let range: number, max: number;
// 		if (total > ARRAY_LIMIT) {
// 			range = +(ms.length / 10).toFixed(0);
// 			max = ms.length % 10 > 0 ? 11 : 10;
// 		} else {
// 			range = ms.length;
// 			max = 1;
// 		}

// 		for (let z = 0; z < max; z++) {
// 			const start = range * z;
// 			const end = range * (z + 1);
// 			const limit = end >= ms.length ? ms.length : end;

// 			console.log({ max, range, start, limit });

// 			const multiArray = new MultiArray();

// 			for (var mi = start, msl = limit; mi < msl; mi++) {
// 				for (var ki = 0, ksl = ks.length; ki < ksl; ki++) {
// 					if (ki % 250 == 0) {
// 						console.log('sum %s => m[%s, %s, %s] : k[%s, %s, %s]', i, mi, msl, msl - mi - 1, ki, ksl, ksl - ki - 1);
// 					}
// 					var add = ms[mi] + ks[ki];
// 					if (add > 0) {
// 						multiArray.push({ mi: mi + 1, ki: ki + 1, sum: add });
// 					}
// 				}
// 			}

// 			multiArray.sort(() => {
// 				let result: SumType[] = ns.map((n, ni) => {
// 					console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
// 					return multiArray.find(n);
// 				});

// 				console.log({ result });

// 				results.push(result);
// 				if (z === max - 1) {
// 					const nSum = new MultiArray();
// 					const final = ns.map((n, ni) => {
// 						const temp: SumType[] = new Array(max);
// 						for (let z = 0; z < max; z++) {
// 							temp[z] = results[z][ni];
// 						}
// 						temp.sort((a, b) => a.sum - b.sum);
// 						console.log({ temp });

// 						return nSum.findIn(temp, n);
// 					});
// 					data += final.map(r => `${r.mi} ${r.ki}`).join('\n');
// 					data += '\n';

// 					if (i === count - 1) {
// 						console.log(data);
// 						writeOutput(data);
// 					}
// 				}

// 			});
// 		}

// 		// const nSum = new MultiArray();
// 		// const final = ns.map((n, ni) => {
// 		// 	const temp: SumType[] = new Array(max);
// 		// 	for (let z = 0; z < max; z++) {
// 		// 		temp[z] = results[z][ni];
// 		// 	}
// 		// 	temp.sort((a, b) => a.sum - b.sum);
// 		// 	return nSum.findIn(temp, n);
// 		// });

// 		// var nSum = new NewArray(ms.length * ks.length);
// 		// var selectedArray = 0;

// 		// for (var mi = 0, msl = ms.length; mi < msl; mi++) {
// 		// 	for (var ki = 0, ksl = ks.length; ki < ksl; ki++) {
// 		// 		if (ki % 250 == 0) {
// 		// 			console.log('sum %s => m[%s, %s] : k[%s, %s] ==> %s', i, mi, msl - mi, ki, ksl - ki, lastIndex);
// 		// 		}
// 		// 		var add = ms[mi] + ks[ki];
// 		// 		// if (mi >= 26100) {
// 		// 		// 	console.log({ lastIndex });
// 		// 		// }
// 		// 		if (add > 0) {
// 		// 			nSum.push(lastIndex++, { mi: mi + 1, ki: ki + 1, sum: add });
// 		// 			// sum[lastIndex++] = { mi: mi + 1, ki: ki + 1, sum: add };
// 		// 		}
// 		// 		if (lastIndex >= limit) {
// 		// 			lastIndex = 0;
// 		// 			nSum.setSelectedArray(++selectedArray);
// 		// 		}
// 		// 	}
// 		// }
// 		// // var sum = nSum.getAll();
// 		// nSum.sort();

// 		// // sum.splice(lastIndex);
// 		// // sum.sort((a, b) => a.sum - b.sum);
// 		// // console.log({ sum });

// 		// // var temp = { sum: 0, mi: 0, ki: 0 };
// 		// let result: SumType[] = ns.map((n, ni) => {
// 		// 	console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
// 		// 	return nSum.find(n);
// 		// });

// 		// console.log({ result });

// 		// data += final.map(r => `${r.mi} ${r.ki}`).join('\n');

// 		// data += '\n';
// 	}
// 	// console.log(data);
// 	// writeOutput(data);
// }

// // export default function startD() {
// // 	// console.log(readInput());
// // 	const { count, lines } = readInfo();
// // 	let data = '';
// // 	for (let i = 0, j = 0; i < count; i++, j = i * 4) {
// // 		const [M, K, N] = lines[j].split(' ').map(Number);

// // 		const ms = lines[j + 1].split(' ').map(Number);
// // 		const ks = lines[j + 2].split(' ').map(Number);
// // 		const ns = lines[j + 3].split(' ').map(Number);

// // 		console.log(M, K, N, ms, ks, ns);

// // 		var sum: SumType[] = new Array(ms.length * ks.length);
// // 		var lastIndex = 0;
// // 		for (var mi = 0, msl = ms.length; mi < msl; mi++) {
// // 			var m = ms[mi];
// // 			for (var ki = 0, ksl = ks.length; ki < ksl; ki++) {
// // 				console.log('sum %s => %s: %s', i, mi, ki);
// // 				const result = m + ks[ki];
// // 				if (result > 0) {
// // 					const sumType = { mi: mi + 1, ki: ki + 1, sum: result };
// // 					sum[lastIndex++] = sumType;
// // 				}
// // 			}
// // 		}
// // 		sum = sum.slice(0, lastIndex);
// // 		sum.sort((a, b) => a.sum - b.sum);
// // 		console.log({ sum });

// // 		let result: SumType[] = ns.map((n, ni) => {
// // 			console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
// // 			return findSmallDelta(sum, n);
// // 		});

// // 		// let result: SumType[] = ns.map((n, ni) => {
// // 		// 	console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);

// // 		// 	const signal = { mi: 0, ki: 0, sum: n };
// // 		// 	sum.unshift(signal);
// // 		// 	sum.sort((a, b) => a.sum - b.sum);

// // 		// 	const signalIndex = sum.indexOf(signal);
// // 		// 	if (signalIndex === 0) {
// // 		// 		sum.splice(signalIndex, 1);
// // 		// 		return sum[1];
// // 		// 	}
// // 		// 	if (signalIndex === sum.length - 1) {
// // 		// 		sum.splice(signalIndex, 1);
// // 		// 		return sum[sum.length - 2];
// // 		// 	}
// // 		// 	const before = sum[signalIndex - 1];

// // 		// 	const after = sum[signalIndex + 1];
// // 		// 	sum.splice(signalIndex, 1);

// // 		// 	const beforeDelta = Math.abs(signal.sum - before.sum);
// // 		// 	if (beforeDelta === 0) {
// // 		// 		return before;
// // 		// 	}

// // 		// 	if (before.sum <= 0) {
// // 		// 		return after;
// // 		// 	}

// // 		// 	const afterDelta = Math.abs(after.sum - signal.sum);
// // 		// 	console.log({ signal, before, after, beforeDelta, afterDelta });

// // 		// 	if (beforeDelta === afterDelta) {
// // 		// 		if (before.mi <= after.mi) {
// // 		// 			return before;
// // 		// 		}
// // 		// 		return after;
// // 		// 	} else if (beforeDelta < afterDelta) {
// // 		// 		return before;
// // 		// 	} else {
// // 		// 		return after;
// // 		// 	}
// // 		// });

// // 		console.log({ result });

// // 		data += result.map(r => `${r.mi} ${r.ki}`).join('\n');

// // 		data += '\n';
// // 	}
// // 	console.log(data);
// // 	writeOutput(data);
// // }

// function sortedPush(array: SumType[], value: SumType) {
// 	array.splice(sortedIndexBy(array, value, st => st.sum), 0, value);
// }

// export function processD() {
// 	const readStream = createReadStream(cacheFile, { encoding: 'utf8' });

// 	const rl = readline.createInterface({
// 		input: readStream,
// 		output: process.stdout,
// 		terminal: false
// 	});
// 	const sum: SumType[] = [];
// 	rl.on('line', (line) => {
// 		const arr = line.split(' ').map(Number);
// 		sortedPush(sum, { mi: arr[0], ki: arr[1], sum: arr[2] });
// 		// sum.push({ mi: arr[0], ki: arr[1], sum: arr[2] });
// 		if (sum.length % 250 == 0) {
// 			console.log(line);
// 		}
// 	});

// 	rl.on('pause', () => {
// 		console.log('read file: done');
// 		// _.sortBy(sum, st => st.sum);
// 		// sum.sort((a, b) => a.sum - b.sum);
// 		// console.log('sorting: done');


// 		const { count, lines } = readInfo();
// 		let data = '';
// 		for (let i = 0, j = 0; i < count; i++, j = i * 4) {
// 			const [M, K, N] = lines[j].split(' ').map(Number);

// 			const ms = lines[j + 1].split(' ').map(Number);
// 			const ks = lines[j + 2].split(' ').map(Number);
// 			const ns = lines[j + 3].split(' ').map(Number);

// 			console.log(M, K, N, ms, ks, ns);
// 			// openCacheFile();

// 			// sum.sort((a, b) => a.sum - b.sum);
// 			console.log({ sum });

// 			let result: SumType[] = ns.map((n, ni) => {
// 				console.log('== start %s : %s, rem: %s ==', i, ni, ns.length - ni);
// 				return exponentialSearch(sum, sum.length, n);
// 			});

// 			console.log({ result });

// 			data += result.map(r => `${r.mi} ${r.ki}`).join('\n');

// 			data += '\n';
// 		}
// 		console.log(data);
// 		writeOutput(data);
// 	});
// }
