import { readInfo, writeOutput } from './read.js';


export default function startA() {
	// console.log(readInput());
	const { count, lines } = readInfo();
	let data = '';
	for (let index = 0; index < count; index++) {
		const line = lines[index];
		const [first, second] = line.split(' ').map(Number);
		data += first + second;
		data += '\n';
	}
	console.log(data);
	writeOutput(data);
}
