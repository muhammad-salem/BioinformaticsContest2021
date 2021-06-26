import { readInput } from '../read.js';


export function solve32() {

	const input = readInput().split('\n').map(str => str.trim()).filter(s => s);

	// console.log(input);

	const [n, m] = input[0].split(' ').map(Number);
	input.splice(0, 1);

	console.log({ n, m, k: input[0].length, l: input.length });




}