import { appendOutput, readInfo, readInput, writeOutput } from '../read.js';

import lodash from 'lodash';
const { max, findKey, uniq } = lodash;

export type Contact = { a: number, b: number, p: number };

export function solve341() {

	const { count, lines } = readInfo();

	writeOutput('');

	const numbers = lines.map(l => l.split(' ').map(Number));

	const T = count;

	let lastLine = 0;
	for (let t = 0; t < T; t++) {
		// const contacts: Contact[][] = new Array([], [], [], [], [], [], []);

		const V = numbers[lastLine][0];
		const D = numbers[lastLine++][1];


		const score: { [key: number]: number } = {};
		let scoreFirstDay: number[] = [];

		// const AAAA = new Array<{ b: number, p: number }[]>(V);

		// const DA = new Array<{ b: number, p: number }[][]>(D);

		for (let d = 0; d < D; d++) {
			const Ed = numbers[lastLine++][0];
			// const da = new Array(V);
			// DA[d] = da;
			// let l = 0;
			for (let e = 0; e < Ed; e++) {
				const [a, b, p] = numbers[lastLine++];
				score[a] ||= 0;
				// da[a] ||= new Array(V);
				// da[a][score[a]++] = { b, p };
				// contacts[d].push({ a, b, p });
				score[a]++
				if (d == 1) {
					scoreFirstDay.push(a);
				}
			}
		}
		scoreFirstDay = uniq(scoreFirstDay);
		// console.log(scoreFirstDay, score);



		// console.log({ score, contacts });
		let maxNum = max(Object.values(score))!;

		let maxA: string = findKey(score, c => c === maxNum)!;


		console.log(maxA, maxNum);

		appendOutput(maxA + '\n');
	}
}