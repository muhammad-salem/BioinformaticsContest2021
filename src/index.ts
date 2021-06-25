import { readProblemName } from './read.js';
import startD412 from './start-d-4.js';
import startA from './test-a.js';
import startB from './test-b.js';
import startC from './test-c.js';
import startD from './test-d.js';

const problemName = readProblemName();

switch (problemName) {
	case 'a': startA(); break;
	case 'b': startB(); break;
	case 'c-1':
	case 'c-2':
		startC(); break;
	case 'd-0':
	case 'd-2':
	case 'd-3':
	case 'd-5':
	// startD(); break;
	// processD(); break;
	case 'd-1':
	case 'd-4':
	case 'd-41':
	case 'd-42':
		startD412(); break;
	default:
		break;
}
