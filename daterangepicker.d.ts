import { BindingHandlers, BindingHandler, Observable, Computed, ObservableArray } from 'knockout';
import * as dayjs from 'dayjs';
// import * as updateLocale from 'dayjs/plugin/updateLocale';


declare global {
    export interface BindingHandlers {
        daterangepicker: BindingHandler;
    }

    export interface JQuery {
        daterangepicker: DateRangePicker;
        data(key: 'daterangepicker'): DateRangePickerView | undefined;
    }
}

declare module 'knockout' {
    export interface Computed<T> {
        mode?: string;
        fit: (date?: dayjs.Dayjs | string) => dayjs.Dayjs;
        clone: (date?: dayjs.Dayjs | string) => dayjs.Dayjs;
        isWithinBoundaries: (date?: dayjs.Dayjs | string) => boolean;
    }
    export interface Observable<T> {
        scale?(period: string): string;
        showWeekDayNames?(period: string): boolean;
        nextPageArguments?(period: string): [number, string];
        format?(period: string): string;
        title?(period: string, localeObj: Locale): string;
        dimensions?(period: string): number[];
        extendObservable?(observable: string | [string, Locale]): Observable<string> | Observable<Locale>;
    }
}

export interface Locale {
    applyButtonTitle: 'Apply',
    cancelButtonTitle: 'Cancel',
    inputFormat: 'L',
    startLabel: 'Start',
    endLabel: 'End',
    dayLabel: 'Day',
    weekLabel: 'Week',
    monthLabel: 'Month',
    quarterLabel: 'Quarter',
    yearLabel: 'Year',
    months: string[],
    monthsShort: string[],
    weekdays: string[],
    weekdaysShort: string[],
    weekdaysMin: string[],
    ordinal?(n: number): string,
    formats?: object,
    relativeTime?: object,
    meridiem?(hour: number, minute: number, isLowerCase: boolean): string
}

export interface DateRangePicker {
    (options?: Options, callback?: DateRangePickerCallback): JQuery;
    ArrayUtils?: ArrayUtils;
    Config?: Config;
    DayjsIterator?: DayjsIterator;
    DayjsUtil?: DayjsUtil;
    Period?: Period;
    DateRangePickerView?: DateRangePickerView;
    DateRange?: DateRange;
    Options?: Options;
}


/*
    The js module extends the JQuery interface ($.fn) with the daterangepicker function
    daterangepicker(options?: Options, callback?: DateRangePickerCallback) => JQuery<HTMLElement>
    This function sets the data property called 'daterangepicker' to a new DateRangePickerCallback
    initialized using the options parameter)

    This same daterangepicker function is extended to include all of the supporting types defined in the module
        ArrayUtils, DayjsIterator, DayjsUtil
        Period, Config
        DateRange, AllTimeDateRange, CustomDateRange
        DateRangePickerView
        CalendarView, CalendarHeaderView

    The only export from the module is the DateRangePickerView class
 */

export interface ArrayUtils {
    rotateArray<T>(array: T[], offset: number): T[];
    uniqArray<T>(array: T[]): T[];
}

export type DateRangePickerCallback = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    period: string | null
) => void;

interface DayjsIteratorInterface {
    array?(date: dayjs.Dayjs, amount: number, period: string): dayjs.Dayjs[];
    next?(): dayjs.Dayjs;
    date: dayjs.Dayjs;
    period: string;

}

export class DayjsIterator implements DayjsIteratorInterface {
    constructor(date: dayjs.Dayjs, period: string);
    static array(date: dayjs.Dayjs, amount: number, period: string): dayjs.Dayjs[];
    next(): dayjs.Dayjs;
    date: dayjs.Dayjs;
    period: string;
}

interface DayjsUtilInterface {
    patchCurrentLocale?(currentLocale: Locale): Locale
    setFirstDayOfTheWeek?(dow: number): Locale;
    tz?(...input: any[]): dayjs.Dayjs;
}

export class DayjsUtil implements DayjsUtilInterface {
    static patchCurrentLocale(currentLocale: Locale): Locale;
    static setFirstDayOfTheWeek(dow: number): Locale;
    static tz(...input: any[]): dayjs.Dayjs;
}

export type allPeriods = 'day' | 'week' | 'month' | 'quarter' | 'year';

export class Period {
    static scale(period: string): string;
    static showWeekDayNames(period: string): boolean;
    static nextPageArguments(period: string): [number, string];
    static format(period: string): string;
    static title(period: string, localeObj: Locale): string;
    static dimentions(period: string): number[];
    static extendObservable(observable: string | [string, Locale]): Observable<string> | Observable<Locale>;
    static allPeriods: string[];
    static methods: string[];
}

export interface DateRangeInterface {
    title?: string;
    startDate?: string | dayjs.Dayjs;
    endDate?: string | dayjs.Dayjs;
}

export class DateRange implements DateRangeInterface {
    constructor(title?: string, startDate?: string | dayjs.Dayjs, endDate?: string | dayjs.Dayjs);
    title?: string;
    startDate?: string | dayjs.Dayjs;
    endDate?: string | dayjs.Dayjs;
}

export interface DateSelection {
    momentObject: dayjs.Dayjs;
    // ('inclusive' | 'exclusive' | 'expanded')
    selectionType: string;
}

export enum PeriodTypes {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    QUARTER = 'quarter',
    YEAR = 'year'
}

export interface DateOption {
    value?: dayjs.Dayjs | string;
    mode?: string;
}

export class Options {
    constructor(...options: any[]);
    timeZone?: string;
    minDate?: dayjs.Dayjs | string | Array<DateOption>;
    maxDate?: dayjs.Dayjs | string | Array<DateOption>;
    startDate?: dayjs.Dayjs | string | Array<DateOption>;
    endDate?: dayjs.Dayjs | string | Array<DateOption>;
    period?: string;
    periods?: string[];
    single?: boolean;
    orientation?: string;
    opened?: boolean;
    expanded?: boolean;
    standalone?: boolean;
    hideWeekdays?: boolean;
    anchorElement?: JQuery<HTMLElement> | HTMLElement;
    parentElement?: JQuery<HTMLElement> | HTMLElement;
    forceUpdate?: boolean;
    customPeriodRanges?: Object;
    ranges?: DateRange[];
    locale?: Locale;
    isCustomPeriodRangeActive?: boolean;
    callback?: (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, period: string) => void;
}

export class Config {
    constructor(options?: Options);
    timeZone?: Observable<string>;
    minDate?: Computed<dayjs.Dayjs>;
    maxDate?: Computed<dayjs.Dayjs>;
    startDate?: Computed<dayjs.Dayjs>;
    endDate?: Computed<dayjs.Dayjs>;
    period?: Observable<string> | Observable<Period>;
    periods?: ObservableArray<string> | ObservableArray<Period>;
    single?: Observable<boolean>;
    orientation?: Observable<string>;
    opened?: Observable<boolean>;
    expanded?: Observable<boolean>;
    standalone?: Observable<boolean>;
    hideWeekdays?: Observable<boolean>;
    anchorElement?: JQuery<HTMLElement> | HTMLElement;
    parentElement?: JQuery<HTMLElement> | HTMLElement;
    forceUpdate?: Observable<boolean>;
    customPeriodRanges?: DateRange[];
    ranges?: DateRange[];
    locale?: Locale;
    isCustomPeriodRangeActive?: Observable<boolean>;
    // allEvents: Observable<Object>;
    callback?: (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, period: string) => void;
    firstDayOfWeek?: Observable<number>;
    extend?(obj: Object): Object;
    _firstDayOfWeek?(val: number): Observable<number>;
    _allEvents?(object: Object): Observable<Object>;
    _timeZone?(tz: string): Observable<string>;
    _periods?(periods: Period[]): ObservableArray<Period>;
    _customPeriodRanges?(obj: any): Object;
    _period?(val: any): Observable<Period>;
    _single?(isSingle: boolean): Observable<boolean>;
    _opened?(isOpened: boolean): Observable<boolean>;
    _expanded?(isExpanded: boolean): Observable<boolean>;
    _standalone?(isStandalone: boolean): Observable<boolean>;
    _hideWeekdays?(hideWeekdays: boolean): Observable<boolean>;
    _minDate?(val: any): Computed<dayjs.Dayjs>;
    _maxDate?(val: any): Computed<dayjs.Dayjs>;
    _startDate?(date: dayjs.Dayjs): Computed<dayjs.Dayjs>;
    _endDate?(date: dayjs.Dayjs): Computed<dayjs.Dayjs>;
    _ranges?(obj: Object): DateRange[];
    defineRange?(range: dayjs.Dayjs): DateRange;
    parseRange?(range: dayjs.Dayjs[], title: string): DateRange;
    _orientation?(orientation: string): Observable<string>;
    _dateObservable?(
        date: dayjs.Dayjs,
        mode: string,
        minBoundary: any,
        maxBoundary: any
    ): Computed<dayjs.Dayjs>;
    _defaultRanges?(): DateRange[];
    _anchorElement?(elementName: string): HTMLElement;
    _parentElement?(elementName: string): HTMLElement;
    _callback?(cb: (...input: any[]) => any): any;
}

export interface AllTimeDateRange extends DateRange { }
export interface CustomDateRange extends DateRange { }

export class DateRangePickerView {
    constructor(
        options?: Options
    );

    periodProxy: Period;
    outsideClick: (event: Event) => Observable<boolean>;
    startCalendar: CalendarView;
    endCalendar: CalendarView;
    startDateInput: Computed<any>;
    endDateInput: Computed<any>;
    dateRange: Observable<any>;
    startDate: Observable<dayjs.Dayjs>;
    endDate: Observable<dayjs.Dayjs>;
    style: Observable<any>;
    callback: (
        startDate: dayjs.Dayjs,
        endDate: dayjs.Dayjs,
        period: Period,
        calStartDate: dayjs.Dayjs,
        calEndDate: dayjs.Dayjs
    ) => any;
    anchorElement: HTMLElement;
    wrapper: HTMLElement;
    containerElement: HTMLElement;
    locale: Locale;
    getLocale(): Locale;
    calendars(): CalendarView[];
    updateDateRange(): ObservableArray<dayjs.Dayjs>;
    isActivePeriod(period: Period): boolean;
    cssClasses(): any;
    isActiveDateRange(dateRange: DateRange): boolean;
    isActiveCustomPeriodRange(customPeriodRange: any): boolean;
    inputFocus(): Observable<boolean>;
    setPeriod(period: Period): Observable<boolean>;
    setDateRange(dateRange: DateRange): Observable<any>;
    setCustomPeriodRange(customPeriodRange: DateRange): Observable<any>;
    applyChanges(): Observable<any>;
    cancelChanges(): void;
    open(): Observable<boolean>;
    close(): any;
    toggle(): any;
    updatePosition(): any;
}

export interface CalendarView {
    inRange: (date: dayjs.Dayjs) => boolean;
    isEvent: (date: dayjs.Dayjs) => boolean;
    tableValues: (date: dayjs.Dayjs) => Object;
    formatDateTemplate: (date: dayjs.Dayjs) => Object;
    eventsForDate: (date: dayjs.Dayjs) => Object;
    cssForDate: (date: dayjs.Dayjs, periodIsDay: boolean) => Object;
    allEvents: Observable<Object>;
    period: Period;
    single: boolean;
    timeZone: string;
    locale: Locale;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    isCustomPeriodRangeActive: Observable<boolean>;
    type: string;
    label: string;
    hoverDate: Observable<dayjs.Dayjs>;
    activeDate: Observable<dayjs.Dayjs>;
    currentDate: Observable<dayjs.Dayjs>;
    inputDate: Computed<dayjs.Dayjs>;
    firstDate: Computed<dayjs.Dayjs>;
    lastDate: Computed<dayjs.Dayjs>;
    headerView: CalendarHeaderView;
    calendar(): any[];
    weekDayNames(): string[];
    firstYearOfDecade(date: dayjs.Dayjs): any
    lastYearOfDecade(date: dayjs.Dayjs): any;
    __range__(left: number, right: number, inclusive: boolean): number[];
}

export interface CalendarHeaderView {
    currentDate: Observable<dayjs.Dayjs>;
    period: Period;
    timeZone: string;
    firstDate: Computed<dayjs.Dayjs>;
    firstYearOfDecade(date: dayjs.Dayjs): any
    prevDate: Computed<dayjs.Dayjs>;
    nextDate: Computed<dayjs.Dayjs>;
    selectedMonth: Computed<any>;
    selectedYear: Computed<any>;
    selectedDecade: Computed<any>;
    clickPrevButton(): Observable<dayjs.Dayjs>;
    clickNextButton(): Observable<dayjs.Dayjs>;
    prevArrowCss(): Object;
    nextArrowCss(): Object;
    monthOptions(): number[];
    yearOptions(): number[];
    decadeOptions(): number[];
    monthSelectorAvailable(): boolean;
    yearSelectorAvailable(): boolean;
    decadeSelectorAvailable(): boolean;
    monthFormatter(month: number): string;
    yearFormatter(year: number): string;
    decadeFormatter(from: number): string;
}

export function __range__(left: number, right: number, inclusive: boolean): number[];
