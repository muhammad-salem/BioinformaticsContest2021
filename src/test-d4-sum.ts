import { sort as TimSort } from 'timsort';
import lodash from 'lodash';
const { sortedIndexBy, remove } = lodash;

export type GroupIndex = { mj: { m: number, mi: number }, kj: { k: number, ki: number }, sum: number };

export const ARRAY_LIMIT = Math.pow(2, 26) - 1;

export const OBJECT_LIMIT = Math.pow(2, 18) - 1;

export class MultiArray {

	private arrays: GroupIndex[][] = [];
	private selectedArray = 0;
	private lastIndex = 0;

	private cacheList: { [key: number]: GroupIndex }[] = [];
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

	resetArray() {
		console.log('reset', this.arrays.length);
		this.arrays.splice(0);
		this.arrays.push(new Array(ARRAY_LIMIT));
		this.selectedArray = 0;
		this.lastIndex = 0;
		console.log('adding new array');
	}

	private addNewCache() {
		this.cacheLength = 0;
		this.selectedCache++;
		this.cacheList.push({});
		console.log('cache length', this.cacheList.length);
	}


	resetCache() {
		this.cacheLength = 0;
		this.selectedCache = 0;
		this.cacheList.splice(0);
		this.cacheList.push({});
		console.log('cache length', this.cacheList.length);
	}
	private spliceSelectedArray() {
		this.arrays[this.selectedArray].splice(this.lastIndex);
	}

	push(info: GroupIndex) {
		this.arrays[this.selectedArray][this.lastIndex++] = info;
		this.cacheList[this.selectedCache][info.sum] = info;
		if (this.lastIndex >= ARRAY_LIMIT) {
			this.addNewArray();
		}
		if (this.cacheLength >= OBJECT_LIMIT) {
			this.addNewCache();
		}
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
			TimSort(this.arrays[i], (a, b) => a.sum - b.sum);
			// this.arrays[i].sort((a, b) => a.sum - b.sum);
			console.log('sort ' + i + ' : done');
		}
	}

	searchIn(signal: number, arrayIndex: number): GroupIndex[] {
		const temp = { sum: signal } as GroupIndex;
		var sum = this.arrays[arrayIndex];
		const index = sortedIndexBy(sum, temp, 'sum');
		if (index === 0) {
			return [sum[0]];
		}
		if (index === sum.length) {
			return [sum[sum.length - 1]];
		}
		if (sum[index].sum === signal) {
			return [sum[index]];
		}
		const before = sum[index - 1];
		const after = sum[index];
		return [before, after];
	}

	findInSum(sum: GroupIndex[], n: number) {
		// console.log('== search: ' + n);
		const temp = { sum: n };
		const index = sortedIndexBy(sum, temp, 'sum');
		return this.searchInArray(n, index, sum);
	}

	private searchInArray(n: number, index: number, group: GroupIndex[]) {
		if (index === 0) {
			return group[0];
		}
		if (index === group.length) {
			return group[group.length - 1];
		}
		const before = group[index - 1];
		const after = group[index];
		return this.compareNum(n, before, after);
	}


	compareNum(n: number, before: GroupIndex, after: GroupIndex) {
		const beforeDelta = Math.abs(n - before.sum);
		if (beforeDelta == 0) {
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

	find(signal: number): GroupIndex {
		const toSearch: GroupIndex[] = new Array(this.arrays.length * 2);
		let l = 0;
		for (let i = 0; i < this.arrays.length; i++) {
			const r = this.searchIn(signal, i);
			r.forEach(d => toSearch[l++] = d);
		}
		toSearch.splice(l);
		return this.findInSum(toSearch, signal);
	}

	destroy() {
		this.arrays.splice(0);
		this.lastIndex = 0;
		this.cacheList.splice(0);
		this.selectedCache = 0;
		this.cacheLength = 0;
		this.selectedCache = -1;
		this.selectedArray = -1
	}

}
