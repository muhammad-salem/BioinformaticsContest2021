import { readFileSync, writeFileSync, appendFileSync, createReadStream } from 'fs';
import { resolve } from 'path';
import { SumType } from './test-d.js';


const args = process.argv.slice(2);
export const problemName = args[0];
export function readProblemName() {
	return problemName;
}

export const inputFile = resolve(process.cwd(), 'inputs', `test-${problemName}.txt`);
export function readInput() {
	// console.log(inputFile);
	const input = readFileSync(inputFile, 'utf-8');
	// console.log(input);
	return input;
}

export function readInfo(): { count: number, lines: string[] } {
	return readInfoFrom(inputFile);
}

export function readInfoFrom(file: string): { count: number, lines: string[] } {
	const input = readFileSync(file, 'utf-8');
	const lines = input.split('\n').map(str => str.trim());
	const count = Number(lines[0]);
	lines.splice(0, 1);
	return { count, lines };
}

export const outputFile = resolve(process.cwd(), 'outputs', `test-${problemName}.txt`);

export function writeOutput(data: string) {
	writeFileSync(outputFile, data);
}

export const cacheDir = resolve(process.cwd(), 'cache');

export function writeCache(fileName: string, data: string) {
	const file = resolve(cacheDir, fileName + '.json');
	writeFileSync(file, data);
	return file;
}

export function resolveCacheFile(fileName: string) {
	return resolve(cacheDir, fileName);
}


export function appendOutput(data: string) {
	appendFileSync(outputFile, data);
}


export function writeDataToFile(fileName: string, data: string) {
	writeFileSync(fileName, data);
}

export function appendDataToFile(fileName: string, data: string) {
	appendFileSync(fileName, data);
}

export function readDataFromFile(fileName: string) {
	return readFileSync(fileName, 'utf-8');
}

export function readLines(filePath: string) {
	return readDataFromFile(filePath).split('\n').map(s => s.trim());
}

export function readInputLines() {
	return readDataFromFile(inputFile).split('\n').map(s => s.trim());
}

export const cacheFile = resolve(process.cwd(), 'outputs', `cache-${problemName}.txt`);

export function openCacheFile() {
	writeFileSync(cacheFile, '[');
}
export function writeJSONCacheFile(obj: {}) {
	appendFileSync(cacheFile, JSON.stringify(obj) + ',');
}
export function closeCacheFile() {
	appendFileSync(cacheFile, '{"remove": 10}]');
}

export function readCachedJSONArray<T>(): T[] {
	const str = readFileSync(cacheFile, 'utf-8');
	const data: (T & { remove: number })[] = JSON.parse(str);
	console.log('removed', data.pop());
	return data;
}

export function openCacheSumFile() {
	writeFileSync(cacheFile, '');
}
export function writeSumToCacheFile(sumType: SumType) {
	appendFileSync(cacheFile, `${sumType.mi} ${sumType.ki} ${sumType.sum}\n`);
}


export function readCachedSumFile(): SumType[] {
	const input = readFileSync(cacheFile, 'utf-8');
	const lines = input.split('\n').map(str => str.trim());
	const data = lines.map(line => line.split(' ').map(Number)).map(arr => ({ mi: arr[0], ki: arr[1], sum: arr[2] }))
	return data;
}

