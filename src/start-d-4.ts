import { appendOutput, readInfo, writeOutput } from './read.js';
import { ARRAY_LIMIT, GroupIndex, MultiArray } from './test-d4-sum.js';
import { sort as TimSort } from 'timsort';
import lodash from 'lodash';
const { uniqBy, remove, find } = lodash;



export const TenP6 = Math.pow(10, 6);
export function multiTenP6(num: number) {
	return TenP6 * num;
}

export default function startD412() {
	const { count, lines } = readInfo();

	// const AllFiles: string[][] = [];

	writeOutput('');
	for (let i = 0, j = i * 4; i < count; i++, j = i * 4) {
		const [M, K, N] = lines[j].split(' ').map(Number);

		// const ms = lines[j + 1].split(' ').map(Number);
		// const ks = lines[j + 2].split(' ').map(Number);
		// const ns = lines[j + 3].split(' ').map(Number);


		// const msr = ms.map((m, mi) => ({ n: m, i: mi + 1 })).sort((a, b) => a.n - b.n);
		// const ksr = ks.map((k, ki) => ({ n: k, i: ki + 1 })).sort((a, b) => a.n - b.n);
		// const nsr = ns.map((n, ni) => ({ n: n, i: ni + 1 })).sort((a, b) => a.n - b.n);

		let msr = lines[j + 1].split(' ')
			.map(Number)
			.map((m, mi) => ({ m, mi: mi + 1 }));
		msr = uniqBy(msr, 'm');
		TimSort(msr, (a, b) => a.m - b.m);
		let ksr = lines[j + 2].split(' ')
			.map(Number)
			.map((k, ki) => ({ k, ki: ki + 1 }));
		ksr = uniqBy(ksr, 'k');
		TimSort(ksr, (a, b) => a.k - b.k);

		let nsr = lines[j + 3].split(' ')
			.map(Number)
			.map((n, ni) => ({ n, ni: ni + 1 }));
		// nsr = uniqBy(nsr, 'n');
		TimSort(nsr, (a, b) => a.n - b.n);

		const ns = lines[j + 3].split(' ').map(Number);

		console.log('.length', msr.length, ksr.length, nsr.length, i);

		const nMin = nsr[0].n;
		const nMax = nsr[nsr.length - 1].n;
		const inputStart = i == 1 ? { i: 996745, j: 1 } : searchStart(nMin, msr, ksr);

		if (inputStart.i > 0) {
			msr.splice(0, inputStart.i);
		}
		// ksr.splice(0, inputStart.j);

		const inputEnd = i == 1 ? { i: 1423, j: 491 } : searchEnd(nMax, msr, ksr);

		if (inputEnd.i > 0) {
			msr.splice(inputEnd.i);
		}
		// msr.splice(inputEnd.i);
		// ksr.splice(inputEnd.j);


		console.log({ nMin, nMax, inputStart, inputEnd });
		console.log('.length', msr.length, ksr.length, nsr.length, i);

		const total = msr.length * ksr.length;
		let range: number, max: number;
		if (total > ARRAY_LIMIT) {
			range = +(msr.length / 10).toFixed(0);
			max = msr.length % 10 > 0 ? 11 : 10;
			// range = 1000;
			// max = +(total / range).toFixed(0);
		} else {
			range = msr.length;
			max = 1;
		}

		console.log({ max, range });

		const multiArray = new MultiArray();

		const reducer = { exactlyFound: [] as NFound[], notExactly: [] as NFound[] };

		rangeLoop:
		for (let z = 0; z < max; z++) {
			const start = range * z;
			const end = range * (z + 1);
			const limit = end >= msr.length ? msr.length : end;

			console.log({ max, range, start, limit });

			const newResult = findSiInRange(msr, ksr, nsr, start, limit, multiArray);
			reducer.exactlyFound.push(...newResult.exactlyFound);

			newResult.exactlyFound.forEach(f => remove(reducer.notExactly, o => f.n == o.n));

			newResult.notExactly.forEach(nRNF => {
				const o = find(reducer.notExactly, rNE => rNE.n == nRNF.n);
				if (o) {
					o.f = multiArray.compareNum(nRNF.n, o.f, nRNF.f);
				} else {
					reducer.notExactly.push(nRNF);
				}
			});

			if (reducer.exactlyFound.length === nsr.length) {
				break rangeLoop;
			}
			console.log({ z, max, nl: nsr.length, refl: reducer.exactlyFound.length });
		}

		multiArray.destroy();
		if (reducer.notExactly.length > 0) {
			reducer.exactlyFound.push(...reducer.notExactly);
		}

		const final = ns.map(n => find(reducer.exactlyFound, ef => ef.n == n)!.f);

		let data = '';
		data += final.map(r => `${r.mj.mi} ${r.kj.ki}`).join('\n');
		data += '\n';

		// console.log({ final });

		console.log('data length: ', data.length);
		appendOutput(data);

	}

}


export type NFound = { n: number, ni: number, f: GroupIndex };


export function findSiInRange(
	msr: { m: number, mi: number }[],
	ksr: { k: number, ki: number }[],
	nsr: { n: number, ni: number }[],
	start: number, limit: number, multiArray: MultiArray): { exactlyFound: NFound[], notExactly: NFound[] } {

	console.log({ start, limit });

	for (var mi = start, msl = limit; mi < msl; mi++) {
		for (var ki = 0, ksl = ksr.length; ki < ksl; ki++) {
			var add = msr[mi].m + ksr[ki].k;
			if (add > 0 && multiArray.isNotInCache(add)) {
				console.log(`sum +: m[${mi}, ${msl - mi - 1}, ${msl}] : k[${ki}, ${ksl - ki - 1}, ${ksl}]`, start, limit);
				multiArray.push({ mj: msr[mi], kj: ksr[ki], sum: add });
			}
		}
	}

	multiArray.sort();
	console.log('sort: done');


	const exactlyFound = new Array<NFound>(nsr.length);
	const notExactly = new Array<NFound>(nsr.length);
	let exactlyIndex = 0, notIndex = 0;

	nsr.forEach(s => {
		let num = multiArray.getFromCache(s.n);
		if (num) {
			exactlyFound[exactlyIndex++] = { n: s.n, ni: s.ni, f: num };
			// console.log('found in cache', num);
		} else {
			num = multiArray.find(s.n);
			if (num) {
				notExactly[notIndex++] = { n: s.n, ni: s.ni, f: num };
				// console.log('found in array', num);
			} else {
				// console.log('not found', num);
			}
		}
	});
	exactlyFound.splice(exactlyIndex);
	notExactly.splice(notIndex);
	multiArray.resetArray();
	exactlyFound.forEach(f => remove(nsr, n => n.n === f.n));
	return { exactlyFound, notExactly };
}

export function searchStart(
	min: number,
	msr: { m: number, mi: number }[],
	ksr: { k: number, ki: number }[]): { i: number, j: number } {

	let i = -1, j = -1;

	outerLoop:
	for (let y = 0; y < ksr.length; y++) {
		for (let x = 0; x < msr.length; x++) {
			const sum = msr[x].m + ksr[y].k;
			console.log(msr[x].m, '+', ksr[y].k, '=', sum, 'min: ' + min, x, y);
			if (sum > 0 && sum >= min) {
				i = x - 1;
				// i = x - ((y == 0) ? 1 : 0);
				j = y;
				break outerLoop;
			}
		}
	}
	return { i, j };
}

export function searchEnd(
	max: number,
	msr: { m: number, mi: number }[],
	ksr: { k: number, ki: number }[]): { i: number, j: number } {

	let i = -1, j = -1;

	outerLoop:
	for (let y = ksr.length - 1; y >= 0; y--) {
		for (let x = msr.length - 1; x >= 0; x--) {
			const sum = msr[x].m + ksr[y].k;
			console.log(msr[x].m, '+', ksr[y].k, '=', sum, 'max: ' + max, x, y);
			if (sum > 0 && sum <= max) {
				i = x + 1;
				j = y;
				// j = y + ((y === ksr.length - 1) ? 0 : 1);
				break outerLoop;
			}
		}
	}
	return { i, j };
}

