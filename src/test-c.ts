import { readInfo, writeOutput } from './read.js';


export default function startC() {
	const { count, lines } = readInfo();
	let data = '';

	// console.log(count, lines.length, lines);

	for (let i = 0, j = 0; i < count; i++) {
		const [n, l] = lines[j].split(' ').map(Number);
		const testCaseLines = lines.slice(j + 1, j + 1 + n);
		// console.log({ n, l, i, j, line: lines[j], testCaseLines });
		j += n + 1;

		const values: string[] = [];
		for (let y = 0; y < l; y++) {
			const numbers: string[] = [];
			for (let x = 0; x < n; x++) {
				numbers.push(testCaseLines[x].charAt(y));
			}
			values.push(numbers.join(''));
		}
		// console.log({ values });
		let lastIndex = 1;
		const signature: { [key: string]: number } = {};
		const mapped = values.map(v => signature[v] || (signature[v] = lastIndex++));
		// console.log({ mapped, lastIndex });

		data += `${lastIndex - 1}\n${mapped.join(' ')}`;
		// data += lastIndex - 1 + '\n' + mapped.join(' ') + '\n';

		data += '\n';
		// console.log({ i, j });
		// break;
	}
	console.log(data);
	writeOutput(data);
}
