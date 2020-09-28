import dayjs, { Dayjs, ConfigType } from 'dayjs';
import { Period, PeriodTypes } from './period';
import { Options } from './options';
import { DayjsUtil } from '../util/util';
import { Locale, ExtendedLocale } from './locale';
import {
    DateRange,
    DateRangeDictionary,
    AllTimeDateRange,
    CustomDateRange,
    PickerDate,
    DatePickerCallback
} from '../daterange/date-range';
import {
    computed,
    Computed as KnockoutComputed,
    Observable as KnockoutObservable,
    observable,
    ObservableArray,
    observableArray,
} from 'knockout';

import { getProperty } from '../util/util';
import $ from 'jquery';

class Config {
    firstDayOfWeek: KnockoutObservable<number>;
    timeZone: KnockoutObservable<string>;
    periods: ObservableArray<PeriodTypes>;
    customPeriodRanges: Array<DateRange>; 
    period: KnockoutObservable<PeriodTypes>;
    single: KnockoutObservable<boolean>;
    opened: KnockoutObservable<boolean>;
    expanded: KnockoutObservable<boolean>;
    standalone: KnockoutObservable<boolean>;
    hideWeekdays: KnockoutObservable<boolean>;
    locale: KnockoutObservable<string>;
    orientation: KnockoutObservable<string>;
    forceUpdate: boolean;
    minDate: KnockoutComputed<PickerDate>;
    maxDate: KnockoutComputed<PickerDate>;
    startDate: KnockoutComputed<ConfigType>;
    endDate: KnockoutComputed<ConfigType>;
    anchorElement: JQuery<HTMLElement>;
    parentElement: JQuery<HTMLElement>;
    
    constructor(options: Options) {
        this.firstDayOfWeek = this._createIntObservable(options.firstDayOfWeek);
        this.timeZone = this._createStringObservable(options.timeZone || 'UTC');
        this.periods = this._periods(options.periods);
        this.customPeriodRanges = this._customPeriodRanges(options.customPeriodRanges);
        this.period = this._period(options.period);
        this.single = this._createBoolObservable(options.single);
        this.opened = this._createBoolObservable(options.opened);
        this.expanded = this._createBoolObservable(options.expanded);
        this.standalone = this._createBoolObservable(options.standalone);
        this.hideWeekdays = this._createBoolObservable(options.hideWeekdays);
        this.locale = this._locale(options.locale);
        this.orientation = this._orientation(options.orientation);
        this.forceUpdate = options.forceUpdate;
        this.minDate = this._minDate(options.minDate);
        this.maxDate = this._maxDate(options.maxDate);
        this.startDate = this._startDate(options.startDate);
        this.endDate = this._endDate(options.endDate);
        this.ranges = this._ranges(options.ranges);
        this.isCustomPeriodRangeActive = this._createBoolObservable();
        this.anchorElement = this._anchorElement(options.anchorElement);
        this.parentElement = this._parentElement(options.parentElement);
        this.callback = this._callback(options.callback);
        this.firstDayOfWeek.subscribe(function (newValue) {
            return DayjsUtil.setFirstDayOfTheWeek(newValue);
        });
        DayjsUtil.setFirstDayOfTheWeek(this.firstDayOfWeek());
    }

    extend(obj: any): any {
        var k, ref, results, v;
        ref = this;
        results = [];
        for (k in ref) {
            v = getProperty(ref, k);
            if (this.hasOwnProperty(k) && k[0] !== '_') {
                results.push(obj[k] = v);
            }
        }
        return results;
    }

    private _createBoolObservable(val?: boolean): KnockoutObservable<boolean> {
        return observable(val);
    }

    private _createIntObservable(val = 0) {
        return observable(val);
    }

    private _createStringObservable(val = ''): KnockoutObservable<string> {
        return observable(val);
    }

    private _periods(val: Array<PeriodTypes>): ObservableArray<PeriodTypes> {
        return observableArray(val || Period.allPeriods);
    }

    private _customPeriodRanges(ranges?: DateRangeDictionary): Array<DateRange> {
        var results, title, value;
        ranges || (ranges = {});
        results = [];
        for (title in ranges) {
            value = ranges[title];
            results.push(this.parseRange(value, title));
        }
        return results;
    }

    private _period(val: PeriodTypes): KnockoutObservable<any> {
        val || (val = this.periods()[0]);
        if (!Period.allPeriods.includes(val)) {
            throw new Error('Invalid period');
        }
        return Period.extendObservable(observable(val));
    }

    private _minDate(val: PickerDate) {
        var mode;
        let minDate: Dayjs | string;
        if (val instanceof Array) {
            [minDate, mode] = val;
        }
        minDate || (minDate = dayjs().subtract(30, 'year'));
        return this._dateObservable(minDate, mode);
    }

    private _maxDate(val: PickerDate) {
        var mode;
        if (val instanceof Array) {
            [val, mode] = val;
        }
        val || (val = dayjs());
        return this._dateObservable(val, mode, this.minDate);
    }

    private _startDate(val) {
        val || (val = dayjs().subtract(29, 'days'));
        return this._dateObservable(val, null, this.minDate, this.maxDate);
    }

    private _endDate(val) {
        val || (val = dayjs());
        return this._dateObservable(val, null, this.startDate, this.maxDate);
    }

    private _ranges(obj) {
        var results, title, value;
        obj || (obj = this._defaultRanges());
        if (!$.isPlainObject(obj)) {
            throw new Error('Invalid ranges parameter (should be a plain object)');
        }
        results = [];
        for (title in obj) {
            value = obj[title];
            switch (value) {
                case 'all-time':
                    results.push(new AllTimeDateRange(title, this.minDate().clone(), this.maxDate().clone()));
                    break;
                case 'custom':
                    results.push(new CustomDateRange(title));
                    break;
                default:
                    results.push(this.parseRange(value, title));
            }
        }
        return results;
    }

    parseRange(value: [string | Dayjs, string | Dayjs] | string | DateRange, title: string): DateRange {
        var endDate, from, startDate, to;
        if (!Array.isArray(value)) {
            throw new Error('Value should be an array');
        }
        [startDate, endDate] = value;
        if (!startDate) {
            throw new Error('Missing start date');
        }
        if (!endDate) {
            throw new Error('Missing end date');
        }
        from = DayjsUtil.tz({ date: startDate, format: this.timeZone() });
        to = DayjsUtil.tz({ date: endDate, format: this.timeZone() });
        if (!from.isValid()) {
            throw new Error('Invalid start date');
        }
        if (!to.isValid()) {
            throw new Error('Invalid end date');
        }
        return new DateRange(title, from, to);
    }

    private _locale(val: any) {
        return $.extend({
            applyButtonTitle: 'Apply',
            cancelButtonTitle: 'Cancel',
            inputFormat: 'L',
            startLabel: 'Start',
            endLabel: 'End',
            dayLabel: 'Day',
            weekLabel: 'Week',
            monthLabel: 'Month',
            quarterLabel: 'Quarter',
            yearLabel: 'Year'
        }, val || {});
    }

    private _orientation(val: string): KnockoutObservable<string> {
        val || (val = 'right');
        if (val !== 'right' && val !== 'left') {
            throw new Error('Invalid orientation');
        }
        return observable(val);
    }

    private _dateObservable(val: Dayjs | string, mode: string, minBoundary?: KnockoutObservable<Dayjs>, maxBoundary?: KnockoutObservable<Dayjs>) {
        var fitMax, fitMin, target;
        target = observable();
        let computedDate = computed({
            read: function () {
                return observable();
            },
            write: (newValue) => {
                var oldValue;
                newValue = computedDate.fit(newValue);
                oldValue = observable();
                if (!(oldValue && newValue.isSame(oldValue))) {
                    return observable(newValue);
                }
            }
        });
        computedDate.mode = mode || 'inclusive';

        fitMin = (val: Dayjs) => {
            var min;
            if (minBoundary) {
                min = minBoundary();
                switch (minBoundary.mode) {
                    case 'extended':
                        min = min.clone().startOf(this.period());
                        break;
                    case 'exclusive':
                        min = min.clone().endOf(this.period()).add(1, 'millisecond');
                }
                val = dayjs.max(min, val);
            }
            return val;
        };
        fitMax = (val: ConfigType) => {
            var max;
            if (maxBoundary) {
                max = maxBoundary();
                switch (maxBoundary.mode) {
                    case 'extended':
                        max = max.clone().endOf(this.period());
                        break;
                    case 'exclusive':
                        max = max.clone().startOf(this.period()).subtract(1, 'millisecond');
                }
                val = dayjs.min(max, val);
            }
            return val;
        };
        computedDate.fit = (val: any) => {
            val = DayjsUtil.tz({ date: val, format: this.timeZone() });
            return fitMax(fitMin(val));
        };
        computedDate(val);
        computedDate.clone = () => {
            return this._dateObservable(observable(), computedDate.mode, minBoundary, maxBoundary);
        };
        computedDate.isWithinBoundaries = (date) => {
            var between, max, maxExclusive, min, minExclusive, sameMax, sameMin;
            date = DayjsUtil.tz({ date, format: this.timeZone() });
            min = minBoundary();
            max = maxBoundary();
            between = date.isBetween(min, max, this.period());
            sameMin = date.isSame(min, this.period());
            sameMax = date.isSame(max, this.period());
            minExclusive = minBoundary.mode === 'exclusive';
            maxExclusive = maxBoundary.mode === 'exclusive';
            return between || (!minExclusive && sameMin && !(maxExclusive && sameMax)) || (!maxExclusive && sameMax && !(minExclusive && sameMin));
        };
        if (minBoundary) {
            computedDate.minBoundary = minBoundary;
            minBoundary.subscribe(function () {
                return computedDate(observable());
            });
        }
        if (maxBoundary) {
            computedDate.maxBoundary = maxBoundary;
            maxBoundary.subscribe(function () {
                return computedDate(observable());
            });
        }
        return computedDate;
    }

    private _defaultRanges(): DateRangeDictionary {
        return {
            'Last 30 days': [dayjs().subtract(29, 'day'), dayjs()],
            'Last 90 days': [dayjs().subtract(89, 'day'), dayjs()],
            'Last Year': [dayjs().subtract(1, 'year').add(1, 'day'), dayjs()],
            'All Time': 'all-time',
            'Custom Range': 'custom'
        };
    }

    private _anchorElement(val: string): JQuery<HTMLElement> {
        return $(val);
    }

    private _parentElement(val?: string): JQuery<HTMLElement> {

        if (val) {
            return $(val);
        } else if (this.standalone()) {
            return this.anchorElement;
        } else {
            return $('body');
        }
    }

    private _callback(val: DatePickerCallback): DatePickerCallback {
        if (val && typeof val !== "function") {
            throw new Error('Invalid callback (not a function)');
        }
        return val;
    }
}

export {
    Period,
    Options,
    Config
};