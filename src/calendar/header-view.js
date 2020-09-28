import dayjs from 'dayjs';
import { ArrayUtils, DayjsUtil, ko } from '../util/util';
import { Period } from '../config/config';
import {
    computed,
    pureComputed
} from 'knockout';

export class CalendarHeaderView {
    constructor(calendarView) {
        this.clickPrevButton = this.clickPrevButton.bind(this);
        this.clickNextButton = this.clickNextButton.bind(this);
        this.currentDate = calendarView.currentDate;
        this.period = calendarView.period;
        this.timeZone = calendarView.timeZone;
        this.firstDate = calendarView.firstDate;
        this.firstYearOfDecade = calendarView.firstYearOfDecade;

        this.prevDate = pureComputed(() => {
            var amount, period;
            [amount, period] = this.period.nextPageArguments();
            return this.currentDate().clone().subtract(amount, period);
        });

        this.nextDate = pureComputed(() => {
            var amount, period;
            [amount, period] = this.period.nextPageArguments();
            return this.currentDate().clone().add(amount, period);
        });

        this.selectedMonth = computed({
            read: () => {
                return this.currentDate().month();
            },
            write: (newValue) => {
                var newDate;
                newDate = this.currentDate().clone().month(newValue);
                if (!newDate.isSame(this.currentDate(), 'month')) {
                    return this.currentDate(newDate);
                }
            },
            pure: true
        });

        this.selectedYear = computed({
            read: () => {
                return this.currentDate().year();
            },
            write: (newValue) => {
                var newDate;
                newDate = this.currentDate().clone().year(newValue);
                if (!newDate.isSame(this.currentDate(), 'year')) {
                    return this.currentDate(newDate);
                }
            },
            pure: true
        });

        this.selectedDecade = computed({
            read: () => {
                return this.firstYearOfDecade(this.currentDate()).year();
            },
            write: (newValue) => {
                var newDate, newYear, offset;
                offset = (this.currentDate().year() - this.selectedDecade()) % 9;
                newYear = newValue + offset;
                newDate = this.currentDate().clone().year(newYear);
                if (!newDate.isSame(this.currentDate(), 'year')) {
                    return this.currentDate(newDate);
                }
            },
            pure: true
        });
    }

    clickPrevButton() {
        return this.currentDate(this.prevDate());
    }

    clickNextButton() {
        return this.currentDate(this.nextDate());
    }

    prevArrowCss() {
        var date, ref;
        date = this.firstDate().clone().subtract(1, 'millisecond');
        if ((ref = this.period()) === 'day' || ref === 'week') {
            date = date.endOf('month');
        }
        return {
            'arrow-hidden': !this.currentDate.isWithinBoundaries(date)
        };
    }

    nextArrowCss() {
        var cols, date, ref, rows;
        [cols, rows] = this.period.dimentions();
        date = this.firstDate().clone().add(cols * rows, this.period());
        if ((ref = this.period()) === 'day' || ref === 'week') {
            date = date.startOf('month');
        }
        return {
            'arrow-hidden': !this.currentDate.isWithinBoundaries(date)
        };
    }

    monthOptions() {
        var maxMonth, minMonth;
        minMonth = this.currentDate.minBoundary().isSame(this.currentDate(), 'year') ? this.currentDate.minBoundary().month() : 0;
        maxMonth = this.currentDate.maxBoundary().isSame(this.currentDate(), 'year') ? this.currentDate.maxBoundary().month() : 11;
        return (function () {
            var results = [];
            for (var i = minMonth; minMonth <= maxMonth ? i <= maxMonth : i >= maxMonth; minMonth <= maxMonth ? i++ : i--) { results.push(i); }
            return results;
        }).apply(this);
    }

    yearOptions() {
        var ref, ref1;
        return (function () {
            var results = [];
            for (var i = ref = this.currentDate.minBoundary().year(), ref1 = this.currentDate.maxBoundary().year(); ref <= ref1 ? i <= ref1 : i >= ref1; ref <= ref1 ? i++ : i--) { results.push(i); }
            return results;
        }).apply(this);
    }

    decadeOptions() {
        return ArrayUtils.uniqArray(this.yearOptions().map((year) => {
            var dayjsObj;
            dayjsObj = DayjsUtil.tz({ date: [year], format: this.timeZone() });
            return this.firstYearOfDecade(dayjsObj).year();
        }));
    }

    monthSelectorAvailable() {
        var ref;
        return (ref = this.period()) === 'day' || ref === 'week';
    }

    yearSelectorAvailable() {
        return this.period() !== 'year';
    }

    decadeSelectorAvailable() {
        return this.period() === 'year';
    }

    monthFormatter(x) {
        return dayjs.utc([2015, x]).format('MMM');
    }

    yearFormatter(x) {
        return dayjs.utc([x]).format('YYYY');
    }

    decadeFormatter(from) {
        var cols, rows, to;
        [cols, rows] = Period.dimentions('year');
        to = from + cols * rows - 1;
        return `${from} – ${to}`;
    }

}