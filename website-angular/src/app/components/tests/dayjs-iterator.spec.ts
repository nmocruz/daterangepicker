import { DayjsIterator } from 'knockout-daterangepicker-fb';
declare var chai: any;
declare var dayjs: any;
const assert = chai.assert;

export function doTests() {
    describe('DayjsIterator', function() {
        const fmt = 'YYYY-MM-DD';

        describe('#next()', function() {
            it('should work', function() {
                let iter = new DayjsIterator(dayjs.utc([2015, 1, 1]), 'month');
                assert.equal(iter.next().format(fmt), '2015-02-01');
                assert.equal(iter.next().format(fmt), '2015-03-01');
            });
        });

        describe('##array()', function() {
            it('should work', function() {
                let arr = DayjsIterator.array(dayjs.utc([2015, 1, 1]), 6, 'month');
                let expectations = [
                    '2015-02-01',
                    '2015-03-01',
                    '2015-04-01',
                    '2015-05-01',
                    '2015-06-01',
                    '2015-07-01'
                ];
                assert.sameMembers(
                    arr.map(function(x) {
                        return x.format(fmt);
                    }),
                    expectations
                );
            });
        });
    });
}
