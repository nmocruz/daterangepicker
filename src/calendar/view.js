
import { DayjsUtil, DayjsIterator, ko } from '../util/util';
import { CalendarHeaderView } from './header-view';
import {
    computed,
    pureComputed,
    observable
} from 'knockout';

export class CalendarView {
    constructor(mainView, dateSubscribable, type) {
        this.inRange = this.inRange.bind(this);
        this.isEvent = this.isEvent.bind(this);
        this.tableValues = this.tableValues.bind(this);
        this.formatDateTemplate = this.formatDateTemplate.bind(this);
        this.eventsForDate = this.eventsForDate.bind(this);
        this.cssForDate = this.cssForDate.bind(this);
        this.period = mainView.period;
        this.single = mainView.single;
        this.timeZone = mainView.timeZone;
        this.locale = mainView.locale;
        this.startDate = mainView.startDate;
        this.endDate = mainView.endDate;
        this.isCustomPeriodRangeActive = mainView.isCustomPeriodRangeActive;
        this.type = type;
        this.label = mainView.locale[`${type}Label`] || '';
        this.hoverDate = observable(null);
        this.activeDate = dateSubscribable;
        this.currentDate = dateSubscribable.clone();
        this.inputDate = computed({
            read: () => {
                return (this.hoverDate() || this.activeDate()).format(this.locale.inputFormat);
            },
            write: (newValue) => {
                var newDate;
                newDate = DayjsUtil.tz({ date: newValue, format: this.locale.inputFormat, timeZone: this.timeZone() });
                if (newDate.isValid()) {
                    return this.activeDate(newDate);
                }
            },
            pure: true
        });
        this.firstDate = pureComputed(() => {
            var date, firstDayOfMonth;
            date = this.currentDate().clone().startOf(this.period.scale());
            switch (this.period()) {
                case 'day':
                case 'week':
                    firstDayOfMonth = date.clone();
                    date.weekday(0);
                    if (date.isAfter(firstDayOfMonth) || date.isSame(firstDayOfMonth, 'day')) {
                        date.subtract(1, 'week');
                    }
                    break;
                case 'year':
                    date = this.firstYearOfDecade(date);
            }
            return date;
        });
        this.lastDate = pureComputed(() => {
            var date, firstDate;
            date = this.currentDate().clone().endOf(this.period.scale());
            switch (this.period()) {
                case 'day':
                case 'week':
                    firstDate = this.firstDate().clone();
                    date = firstDate.add(6, 'week').subtract(1, 'day');
                    break;
                case 'year':
                    date = this.lastYearOfDecade(date);
            }
            return date;
        });
        this.activeDate.subscribe((newValue) => {
            return this.currentDate(newValue);
        });
        this.headerView = new CalendarHeaderView(this);
    }

    calendar() {
        var col, cols, date, i, iterator, ref1, results, row, rows;
        [cols, rows] = this.period.dimentions();
        iterator = new DayjsIterator(this.firstDate(), this.period());
        results = [];
        for (row = i = 1, ref1 = rows; (1 <= ref1 ? i <= ref1 : i >= ref1); row = 1 <= ref1 ? ++i : --i) {
            results.push((function () {
                var k, ref2, results1;
                results1 = [];
                for (col = k = 1, ref2 = cols; (1 <= ref2 ? k <= ref2 : k >= ref2); col = 1 <= ref2 ? ++k : --k) {
                    date = iterator.next();
                    if (this.type === 'end') {
                        results1.push(date.endOf(this.period()));
                    } else {
                        results1.push(date.startOf(this.period()));
                    }
                }
                return results1;
            }).call(this));
        }
        return results;
    }

    weekDayNames() {
        return ArrayUtils.rotateArray(dayjs.weekdaysMin(), dayjs.localeData().firstDayOfWeek());
    }

    inRange(date) {
        return date.isAfter(this.startDate(), this.period()) && date.isBefore(this.endDate(), this.period()) || (date.isSame(this.startDate(), this.period()) || date.isSame(this.endDate(), this.period()));
    }

    tableValues(date) {
        var format, months, quarter;
        format = this.period.format();
        switch (this.period()) {
            case 'day':
            case 'month':
            case 'year':
                return [
                    {
                        html: date.format(format)
                    }
                ];
            case 'week':
                date = date.clone().startOf(this.period());
                return DayjsIterator.array(date, 7, 'day').map((date) => {
                    return {
                        html: date.format(format),
                        css: {
                            'week-day': true,
                            unavailable: this.cssForDate(date, true).unavailable
                        }
                    };
                });
            case 'quarter':
                quarter = date.format(format);
                date = date.clone().startOf('quarter');
                months = DayjsIterator.array(date, 3, 'month').map(function (date) {
                    return date.format('MMM');
                });
                return [
                    {
                        html: `${quarter}<br><span class='months'>${months.join(", ")}</span>`
                    }
                ];
        }
    }

    formatDateTemplate(date) {
        return {
            nodes: $(`<div>${this.formatDate(date)}</div>`).children()
        };
    }

    eventsForDate(date) {
        return {
            click: () => {
                if (this.activeDate.isWithinBoundaries(date)) {
                    return this.activeDate(date);
                }
            },
            mouseenter: () => {
                if (this.activeDate.isWithinBoundaries(date)) {
                    return this.hoverDate(this.activeDate.fit(date));
                }
            },
            mouseleave: () => {
                return this.hoverDate(null);
            }
        };
    }

    cssForDate(date, periodIsDay) {
        var differentMonth, inRange, onRangeEnd, withinBoundaries;
        onRangeEnd = date.isSame(this.activeDate(), this.period());
        withinBoundaries = this.activeDate.isWithinBoundaries(date);
        periodIsDay || (periodIsDay = this.period() === 'day');
        differentMonth = !date.isSame(this.currentDate(), 'month');
        inRange = this.inRange(date);
        return {
            "in-range": !this.single() && (inRange || onRangeEnd),
            [`${this.type}-date`]: onRangeEnd,
            "highlight": !this.single() && (inRange || onRangeEnd),
            "clickable": withinBoundaries && !this.isCustomPeriodRangeActive(),
            "out-of-boundaries": !withinBoundaries || this.isCustomPeriodRangeActive(),
            "unavailable": periodIsDay && differentMonth
        };
    }

    firstYearOfDecade(date) {
        var currentYear, firstYear, offset, year;
        // we use current year here so that it's always in the middle of the calendar
        currentYear = DayjsUtil.tz({ date: dayjs(), format: this.timeZone() }).year();
        firstYear = currentYear - 4;
        offset = Math.floor((date.year() - firstYear) / 9);
        year = firstYear + offset * 9;
        return DayjsUtil.tz({ date: [year], format: this.timeZone() }).startOf('year');
    }

    lastYearOfDecade(date) {
        var currentYear, lastYear, offset, year;
        // we use current year here so that it's always in the middle of the calendar
        currentYear = DayjsUtil.tz({ date: dayjs(), format: this.timeZone() }).year();
        lastYear = currentYear + 4;
        offset = Math.ceil((date.year() - lastYear) / 9);
        year = lastYear + offset * 9;
        return DayjsUtil.tz({ date: [year], format: this.timeZone() }).endOf('year');
    }

}