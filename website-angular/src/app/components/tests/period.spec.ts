import { Period } from 'knockout-daterangepicker-fb';
import { describe, it } from 'mocha/mocha';
import { assert } from 'chai';


export function doTests() {
    describe('Period', function() {
        describe('##extendObservable()', function() {
            it('should work', function() {
                const observablePeriod = Period.extendObservable(
                    'quarter'
                );
                assert.equal(
                    observablePeriod.format('quarter'),
                    Period.format('quarter')
                );
            });
        });
    });
}
