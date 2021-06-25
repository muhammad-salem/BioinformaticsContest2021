import lodash from 'lodash';
const { sortedIndexBy, sortBy } = lodash;

export type SubIndex = { n: number, ni: number, k: number, ki: number, sub: number };

const ARRAY_LIMIT = Math.pow(2, 26) - 1;

const OBJECT_LIMIT = Math.pow(2, 20) - 1;

export class MultiArray {

	private arrays: SubIndex[][] = [];
	private selectedArray = 0;
	private lastIndex = 0;

	private cacheList: (object & { [key: number]: SubIndex })[] = [];
	private selectedCache = 0;
	private cacheLength = 0;

	constructor() {
		this.arrays.push(new Array(ARRAY_LIMIT));
		this.cacheList.push({});
		console.log(this);
	}

	private addNewArray() {
		console.log('splice', this.lastIndex, this.arrays[this.selectedArray].length);
		this.arrays[this.selectedArray].splice(this.lastIndex);
		this.arrays.push(new Array(ARRAY_LIMIT));
		this.selectedArray++;
		this.lastIndex = 0;
		console.log('adding new array');
	}

	private addNewCache() {
		this.cacheLength = 0;
		this.selectedCache++;
		this.cacheList.push({});
		console.log('cache length', this.cacheList.length);
	}

	private spliceSelectedArray() {
		this.arrays[this.selectedArray].splice(this.lastIndex);
	}

	push(info: SubIndex) {
		this.arrays[this.selectedArray][this.lastIndex++] = info;
		// this.cacheList[this.selectedCache][info.sub] = info;
		if (this.lastIndex >= ARRAY_LIMIT) {
			this.addNewArray();
		}
		// if (this.cacheLength >= OBJECT_LIMIT) {
		// 	this.addNewCache();
		// }
	}

	isNotInCache(num: number) {
		for (const cache of this.cacheList) {
			if (cache.hasOwnProperty(num)) {
				return false;
			}
		}
		return true;
	}

	getFromCache(num: number) {
		for (const cache of this.cacheList) {
			if (cache.hasOwnProperty(num)) {
				return cache[num];
			}
		}
	}

	sort() {
		this.spliceSelectedArray();
		for (let i = 0; i < this.arrays.length; i++) {
			console.log('sort info: ', i, this.arrays[i].length, this.arrays.length);
			this.arrays[i].sort((a, b) => a.sub - b.sub);
			console.log('sort ' + i + ' : done');
		}
	}

	searchIn(signal: number, arrayIndex: number): SubIndex[] {
		const temp = { ni: 0, ki: 0, sub: signal };
		var sum = this.arrays[arrayIndex];
		const index = sortedIndexBy(sum, temp, 'sub');
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

	findInSub(sum: SubIndex[], n: number) {
		console.log('== search: ' + n);
		const temp = { ni: 0, ki: 0, sub: n };
		const index = sortedIndexBy(sum, temp, 'sub');
		return this.searchInArray(n, index, sum);
		// if (index === 0) {
		// 	const r = sum[0];
		// 	sum.pop();
		// 	return r;
		// }
		// if (index === sum.length) {
		// 	const r = sum[sum.length - 1];
		// 	sum.pop();
		// 	return r;
		// }
		// const before = sum[index - 1];
		// const beforeDelta = Math.abs(n - before.sub);
		// if (beforeDelta == 0) {
		// 	sum.splice(index - 1, 1);
		// 	return before;
		// }
		// const after = sum[index];
		// // if (!after) {
		// // 	return before;
		// // }
		// const afterDelta = Math.abs(after.sub - n);
		// if (afterDelta == 0) {
		// 	sum.splice(index, 1);
		// 	return after;
		// }
		// if (beforeDelta === afterDelta) {
		// 	sum.splice(index - 1, 1);
		// 	return before;
		// } else if (beforeDelta < afterDelta) {
		// 	sum.splice(index - 1, 1);
		// 	return before;
		// } else {
		// 	sum.splice(index, 1);
		// 	return after;
		// }
	}
	findInSum(sum: SubIndex[], n: number) {
		console.log('== search: ' + n);
		const temp = { ni: 0, ki: 0, sub: n };
		const index = sortedIndexBy(sum, temp, 'sum');
		return this.searchInArray(n, index, sum);
	}

	private searchInArray(n: number, index: number, sum: SubIndex[]) {
		if (index === 0) {
			return sum[0];
		}
		if (index === sum.length) {
			return sum[sum.length - 1];
		}
		const before = sum[index - 1];
		const beforeDelta = Math.abs(n - before.sub);
		if (beforeDelta == 0) {
			return before;
		}
		const after = sum[index];
		// if (!after) {
		// 	return before;
		// }
		const afterDelta = Math.abs(after.sub - n);
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

	find(signal: number): SubIndex {
		const toSearch: SubIndex[] = new Array(this.arrays.length * 2);
		let l = 0;
		for (let i = 0; i < this.arrays.length; i++) {
			const r = this.searchIn(signal, i);
			r.forEach(d => toSearch[l++] = d);
		}
		toSearch.splice(l);
		return this.findInSum(toSearch, signal);
	}

	clearArray() {
		this.arrays.forEach(arr => arr.splice(0));
		this.arrays.splice(0);
		// this.arrays = undefined as any;
		// this.cacheList = [];
	}

	initNewLoop() {
		this.clearArray();
		this.arrays.push(new Array(ARRAY_LIMIT));
	}

	destroy() {
		this.arrays.forEach(arr => arr.splice(0));
		this.arrays.splice(0);
		this.arrays = undefined as any;
		this.cacheList = undefined as any;
	}

}

export const TenP6 = Math.pow(10, 6);
export function multiTenP6(num: number) {
	return TenP6 * num;
}


export function findInRange(
	msr: { m: number, mi: number, found: SubIndex }[],
	ksr: { k: number, ki: number }[],
	nsr: { n: number, ni: number }[]) {

	// const { count, lines } = readInfo();

	// const [M, K, N] = lines[j].split(' ').map(Number);

	// var ms = lines[j + 1].split(' ').map(Number);
	// var ks = lines[j + 2].split(' ').map(Number);
	// var ns = lines[j + 3].split(' ').map(Number);

	// const msr = ms.map((m, mi) => ({ n: m, i: mi + 1 })).sort((a, b) => a.n - b.n);
	// const ksr = ks.map((k, ki) => ({ n: k, i: ki + 1 })).sort((a, b) => a.n - b.n);
	// const nsr = ns.map((n, ni) => ({ n: n, i: ni + 1 })).sort((a, b) => a.n - b.n);


	// console.log({ max, range, start, limit });

	// const multiArray = new MultiArray();

	// for (var mi = start, msl = limit; mi < msl; mi++) {
	// 	for (var ki = 0, ksl = ksr.length; ki < ksl; ki++) {
	// 		var add = msr[mi].n + ksr[ki].n;
	// 		if (add > 0 && multiArray.isNotInCache(add)) {
	// 			console.log(`sum ${i} => m[${mi}, ${msl - mi - 1}, ${msl}] : k[${ki}, ${ksl - ki - 1}, ${ksl}]`, start, limit, range, max);
	// 			multiArray.push({ mi: msr[mi].i, ki: ksr[ki].i, sum: add });
	// 		}
	// 	}
	// }

	// const multiArray = new MultiArray();
	const list: SubIndex[] = new Array(nsr.length * ksr.length);
	const cache: { [key: number]: SubIndex } = {};
	var lastIndex = 0;
	for (let ni = 0, nl = nsr.length; ni < nl; ni++) {
		for (let ki = 0, kn = ksr.length; ki < kn; ki++) {
			var sub = nsr[ni].n - ksr[ki].k;
			// if (sub > 0) {
			if (ki == 0) {
				console.log('sub', sub, ni, ki);
			}
			const h = { n: nsr[ni].n, ni: nsr[ni].ni, k: ksr[ki].k, ki: ksr[ki].ki, sub };
			list[lastIndex++] = h;
			cache[sub] = h;
			// multiArray.push({ ni: nsr[ni].ni, ki: ksr[ki].ki, sub });
			// }
		}
	}

	list.splice(lastIndex);
	console.log('sorting');
	sortBy(list, 'sub');
	// multiArray.sort();
	console.log('after sort, search');

	msr.forEach(mo => {
		// let num = multiArray.getFromCache(mo.n);
		// if (num) {
		// 	mo.found = num;
		// 	console.log('found in cache', mo);
		// } else {
		// 	num = multiArray.find(mo.n);
		// 	mo.found = num;
		// 	console.log('search: done', mo);
		// }
		// mo.found = multiArray.find(mo.m);
		mo.found = cache[mo.m];
		if (mo.found) {
			console.log('found in cache', mo);
		} else {
			mo.found = MultiArray.prototype.findInSub(list, mo.m);
			console.log('search: done', mo);
		}
		// mo.found = MultiArray.prototype.findInSub(list, mo.m);
		// console.log('search: done', mo);
	});
	// multiArray.destroy();
	// const result: SumType[] = ksr.map((n, ni) => {
	// 	console.log(`== start search${n}, ${i} : ${ni}, rem: ${ns.length - ni} ==`);
	// 	let num = multiArray.getFromCache(n);
	// 	if (num) {
	// 		console.log('found in cache', n, num);
	// 		return num;
	// 	}
	// 	num = multiArray.find(n);
	// 	console.log('search: done', n, num);
	// 	return num;
	// });
	// return result;

	// console.log({ range, max, result });
	// const fileName = 'worker-d4' + i + '-' + start + '-' + limit + '-' + msr.length;
	// console.log('write data to: ' + fileName);
	// const file = writeCache(fileName, JSON.stringify(result));
	// multiArray.clearArray();
	// return file;
}

export function flatNS(ns: { n: number; ni: number; mi: number; ki: number; sum: number; }[], msr: { m: number, mi: number, found: SubIndex }[]) {
	ns.forEach(s => {
		// propertyOf(msr)('');
		// sortedIndexBy(msr, { n: 0, i: 0, found: { ni: s.ni, ki: 0, sub: 0 }, propertyOf(msr)('found') });

		const r = msr.filter(m => (s.n === m.found.n));
		if (r.length > 0) {

			// MultiArray.prototype.findInSum();
			s.mi = r[0].mi;
			s.ki = r[0].found.ki;
		} else {
			console.log('not found', s);
			s.mi = 1;
			s.ki = 1;
		}

	});
}
