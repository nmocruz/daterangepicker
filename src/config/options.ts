import { Period, PeriodTypes } from './period';
import dayjs from 'dayjs';
import { DateRangeDictionary, DatePickerCallback, PickerDate } from '../daterange/date-range';
import { ExtendedLocale } from './locale';

export class Options {
    firstDayOfWeek = 0;
    timeZone = 'UTC';
    periods = Period.allPeriods;
    customPeriodRanges: DateRangeDictionary = {};
    period: PeriodTypes = 'day';
    single = false;
    opened = false;
    expanded = false;
    standalone = false;
    hideWeekdays = false;
    locale: ExtendedLocale = {};
    orientation = 'right';
    forceUpdate = false;
    minDate: PickerDate = dayjs().subtract(30, 'year');
    maxDate: PickerDate = dayjs();
    startDate: PickerDate = dayjs().subtract(29, 'day');
    endDate: PickerDate = dayjs();
    ranges: DateRangeDictionary = {};
    isCustomPeriodRangeActive = false;
    anchorElement = '';
    parentElement = '';
    callback: DatePickerCallback;

    constructor(options: any) {
        this.firstDayOfWeek = options.firstDayOfWeek || this.firstDayOfWeek;
        this.timeZone = options.timeZone || this.timeZone;
        this.periods = options.periods || this.periods;
        this.customPeriodRanges = options.customPeriodRanges || this.customPeriodRanges;
        this.period = options.period || this.period;
        this.single = options.single || this.single;
        this.opened = options.opened || this.opened;
        this.expanded = options.expanded || this.expanded;
        this.standalone = options.standalone || this.standalone;
        this.hideWeekdays = options.hideWeekdays || this.hideWeekdays;
        this.locale = options.locale || this.locale;
        this.orientation = options.orientation || this.orientation;
        this.forceUpdate = options.forceUpdate || this.forceUpdate;
        this.minDate = options.minDate || this.minDate;
        this.maxDate = options.maxDate || this.maxDate;
        this.startDate = options.startDate || this.startDate;
        this.endDate = options.endDate || this.endDate;
        this.ranges = options.ranges || this.ranges;
        this.isCustomPeriodRangeActive = options.isCustomPeriodRangeActive || this.isCustomPeriodRangeActive;
        this.anchorElement = options.anchorElement || this.anchorElement;
        this.parentElement = options.parentElement || this.parentElement;
        this.callback = options.callback || this.callback;
    }
}