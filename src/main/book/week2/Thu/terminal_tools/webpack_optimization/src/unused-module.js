// This entire module is imported but never used
// Demonstrates dead code that should be eliminated

import * as _ from 'lodash';
import moment from 'moment';

export function deadCode1() {
    console.log('This function is never called');
    return _.range(0, 100);
}

export function deadCode2() {
    return moment().add(1, 'day').format('YYYY-MM-DD');
}

export const unusedConstant = 'This constant is never used';

export class UnusedClass {
    constructor() {
        this.data = _.times(50, i => i * 2);
    }
    
    processData() {
        return this.data.map(item => item * 3);
    }
}

// More dead code
export default {
    version: '1.0.0',
    name: 'Unused Module',
    functions: [deadCode1, deadCode2],
    class: UnusedClass
};