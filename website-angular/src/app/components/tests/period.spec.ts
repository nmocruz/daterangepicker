import { Period } from 'knockout-daterangepicker-fb';

declare var chai: any;
declare var moment: any;
const assert = chai.assert;
declare var ko: any;

export function doTests() {
    describe('Period', function() {
        describe('##extendObservable()', function() {
            it('should work', function() {
                const observable = Period.extendObservable(ko.observable('quarter'));
                assert.equal(observable.format('quarter'), Period.format('quarter'));
            });
        });
    });
}
