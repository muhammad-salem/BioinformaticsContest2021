import { readInfo, writeOutput } from './read.js';


export default function startB() {
	const { count, lines } = readInfo();
	let data = '';

	// console.log(count, lines.length, lines);

	for (let i = 0, j = 0; i < count; i++, j = i * 2) {
		const s = lines[j];
		const t = lines[j + 1];
		const regExp = new RegExp(t, 'g');

		let regexArray: RegExpExecArray | null;
		const indexes: number[] = [];
		while ((regexArray = regExp.exec(s)) !== null) {
			indexes.push(regexArray.index);
		}
		data += indexes.map(index => index + 1).join(' ');
		data += '\n';
		console.log(i, j, data);
	}
	console.log(data);
	writeOutput(data);
}
