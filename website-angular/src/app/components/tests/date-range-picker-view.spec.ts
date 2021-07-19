import { DateRangePickerView, Options, DateRange } from 'knockout-daterangepicker-fb';
declare var chai: any;
declare var moment: any;
const assert = chai.assert;

export function doTests() {
    describe('DateRangePickerView', function() {
        $('.secondary-section').after($(`<div id='daterangepickerview-test-container' style='display: none'></div>`));
        const parentSelector = '#daterangepickerview-test-container';

        function createPickerView(options?: Options): any {
            return new DateRangePickerView(
                $.extend(
                    options,
                    { parentElement: parentSelector }
                )
             );
         }

        describe('#calendars', function() {
            it('defaults to two', function() {
                const d = createPickerView();
                assert.equal(d.calendars().length, 2);
            });

            it('has single calendar when single is set', function() {
                const d = createPickerView({ single: true });
                assert.equal(d.calendars().length, 1);
            });

            describe('forceUpdate', function() {
                it('does not invoke callback on creation when undefined', function() {
                    let called = false;

                    const cb = function() {
                        return called = true;
                    };

                    const d = createPickerView({
                        callback: cb
                    });
                    assert.isFalse(called);
                });

                it('invokes callback on creation when true', function() {
                    let called = false;

                    const cb = function() {
                        return called = true;
                    };

                    const d = createPickerView({
                        callback: cb,
                        forceUpdate: true
                    });
                    assert.isTrue(called);
                });
            });
        });
        describe('#isActivePeriod', function() {
            it('defaults to day when no custom periods defined', function() {
                const d = createPickerView({});
                assert.isTrue(d.isActivePeriod('day'));
            });

            it('defaults to first period when custom periods defined', function() {
                const d = createPickerView({
                    periods: ['month', 'week', 'day']
                });
                assert.isTrue(d.isActivePeriod('month'));
            });
        });
        describe('#setPeriod', function() {
            it('works with valid period', function() {
                const d = createPickerView({});
                d.setPeriod('week');
                assert.equal(d.isActivePeriod('week'), true);
            });
        });
        describe('#setDateRange #isActiveDateRange', function() {
            it('works with default ranges', function() {
                const d = createPickerView({});
                const range = d.ranges()[0];
                assert.instanceOf(range, $.fn.daterangepicker.DateRange);
                d.setDateRange(range);
                assert.isTrue(d.isActiveDateRange(range));
            });

            it('works with custom ranges', function() {
                const d = createPickerView({
                    ranges: [
                        new DateRange(
                            'May 2015',
                            moment.utc('2015-05-01'),
                            moment.utc('2015-05-31')
                        )
                    ]
                });
                const range = d.ranges()[0];
                assert.instanceOf(range, $.fn.daterangepicker.DateRange);
                d.setDateRange(range);
                assert.isTrue(d.isActiveDateRange(range));
            });
        });

        describe('open and closed states', function() {
            it('is not open by default', function() {
                const d = createPickerView({});
                assert.isFalse(d.opened());
            });

            it('works with opened flag', function() {
                $(parentSelector).append($(`<div id='open-test-anchor-one'></div>`));
                const d = createPickerView({
                    opened: true,
                    anchorElement: $('#open-test-anchor-one')
                });
                assert.isTrue(d.opened());
            });
        });

        describe('interaction methods', function() {
            const d = createPickerView({});

            it('works with #open', function() {
                assert.isFalse(d.opened());
                d.open();
                assert.isTrue(d.opened());
            });

            it('works with #close', function() {
                d.close();
                assert.isFalse(d.opened());
            });

            it('works with #toggle', function() {
                d.toggle();
                assert.isTrue(d.opened());
                d.toggle();
                assert.isFalse(d.opened());
            });
        });
    });
}
