export class CalendarHeaderView {
    constructor(calendarView: any);
    clickPrevButton(): any;
    clickNextButton(): any;
    currentDate: any;
    period: any;
    timeZone: any;
    firstDate: any;
    firstYearOfDecade: any;
    prevDate: import("knockout").PureComputed<any>;
    nextDate: import("knockout").PureComputed<any>;
    selectedMonth: import("knockout").Computed<any>;
    selectedYear: import("knockout").Computed<any>;
    selectedDecade: any;
    prevArrowCss(): {
        'arrow-hidden': boolean;
    };
    nextArrowCss(): {
        'arrow-hidden': boolean;
    };
    monthOptions(): any;
    yearOptions(): any;
    decadeOptions(): any[];
    monthSelectorAvailable(): boolean;
    yearSelectorAvailable(): boolean;
    decadeSelectorAvailable(): boolean;
    monthFormatter(x: any): any;
    yearFormatter(x: any): any;
    decadeFormatter(from: any): string;
}
