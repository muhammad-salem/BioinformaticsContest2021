import { parentPort, workerData } from 'worker_threads';
import { SumType } from './test-d.js';

parentPort!.postMessage(sort(workerData.array));

function sort(array: SumType[]) {
	parentPort?.postMessage(`ARRAY ${array.length}`);
	parentPort?.postMessage(`start sort ${array.length}`);
	array.sort((a, b) => a.sum - b.sum);
	parentPort?.postMessage(`end sort ${array.length}`);
	parentPort?.postMessage('done');
}
