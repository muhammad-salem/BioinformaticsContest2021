import { solve32 } from './32/1.js';
import { solve341 } from './34/341.js';
import { solve351 } from './35/351.js';
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
	case '321':
		solve32(); break;
	case '341':
	case '342':
	case '343':
	case '344':
	case '345':
	case '346':
	case '347':
	case '348':
		solve341(); break;
	case '5-easy/00':
	case '5-easy/10-welcome':
	case '5-easy/20-mouse-simple-exact':
	case '5-easy/30-mouse-exac':
	case '5-easy/35-mouse-inexact':
	case '5-easy/55-huge-inexact':
	case '5-easy/60-huge-inexact':

		solve351(); break;

	default:
		break;
}
