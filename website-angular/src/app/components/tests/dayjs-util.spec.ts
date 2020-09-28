import { DayjsUtil, Config, DateRangePickerView, CalendarView } from 'knockout-daterangepicker-fb';
declare var chai: any;
declare var dayjs: any;
const assert = chai.assert;

export function doTests() {
    describe('DayjsUtil', function() {
        let calendarView = new DateRangePickerView({}).calendars()[0];

        describe('#setFirstDayOfTheWeek()', function() {
            let originalFirstDayOfWeek = null;

            function weekTest(number: number, day: string) {
                DayjsUtil.setFirstDayOfTheWeek(number);
                assert.equal(dayjs().startOf('week').format('dddd'), day);
                assert.equal(calendarView.weekDayNames()[0], day.substr(0, 2));
            }

            function before() {
                originalFirstDayOfWeek = dayjs.localeData().firstDayOfWeek()
            }

            function after() {
                DayjsUtil.setFirstDayOfTheWeek(originalFirstDayOfWeek);
            }

            it('should work when I set it to 5 (Friday)', function() {
                weekTest(5, 'Friday');
            });

            it('should work when I set it to 1 (Monday)', function() {
                weekTest(1, 'Monday');
            });

            it('should work when I set it to the same day (Monday)', function() {
                weekTest(1, 'Monday');
            });

            it('should work with negative numbers', function() {
                weekTest(-1, 'Saturday');
                weekTest(-13, 'Monday');
            });

            it('should work with numbers > 6', function() {
                weekTest(7, 'Sunday');
                weekTest(8 + 7, 'Monday');
            });
        });
    });
}
