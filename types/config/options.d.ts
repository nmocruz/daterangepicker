export class Options {
    constructor(options: any);
    firstDayOfWeek: number;
    timeZone: string;
    periods: string[];
    customPeriodRanges: {};
    period: string;
    single: boolean;
    opened: boolean;
    expanded: boolean;
    standalone: boolean;
    hideWeekdays: boolean;
    locale: {};
    orientation: string;
    forceUpdate: boolean;
    minDate: any;
    maxDate: any;
    startDate: any;
    endDate: any;
    ranges: any;
    isCustomPeriodRangeActive: boolean;
    anchorElement: string;
    parentElement: string;
    callback: any;
}
