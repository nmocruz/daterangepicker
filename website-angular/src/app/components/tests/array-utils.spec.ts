declare var chai : any;
const assert = chai.assert;

export function doTests() {
    describe('ArrayUtils', function() {
        const ArrayUtils = $.fn.daterangepicker.ArrayUtils;
        describe('##rotateArray()', function() {

            it('should with a positive number', function() {
                assert.deepEqual(ArrayUtils.rotateArray([1, 2, 3, 4], 2), [3, 4, 1, 2]);
            });

            it('should with a large positive number', function() {
                assert.deepEqual(ArrayUtils.rotateArray([1, 2, 3, 4], 10), [3, 4, 1, 2]);
            });

            it('should work a negative number', function() {
                assert.deepEqual(ArrayUtils.rotateArray([1, 2, 3, 4], -2), [3, 4, 1, 2]);
            });
            it('should with a large negative number', function() {
                assert.deepEqual(ArrayUtils.rotateArray([1, 2, 3, 4], -10), [3, 4, 1, 2]);
            });

            it('should work a zero', function() {
                assert.deepEqual(ArrayUtils.rotateArray([1, 2, 3, 4], 0), [1, 2, 3, 4]);
            });
        });

        describe('##uniqArray()', function() {
            it('should work', function() {
                assert.sameMembers(ArrayUtils.uniqArray([1, 2, 3, 1, 2, 4]), [1, 2, 3, 4]);
            });
        });
    });
}
