export class CalendarView {
    constructor(mainView: any, dateSubscribable: any, type: any);
    inRange(date: any): any;
    isEvent: any;
    tableValues(date: any): {
        html: any;
        css: {
            'week-day': boolean;
            unavailable: boolean;
        };
    }[] | {
        html: any;
    }[];
    formatDateTemplate(date: any): {
        nodes: JQuery<HTMLElement>;
    };
    eventsForDate(date: any): {
        click: () => any;
        mouseenter: () => any;
        mouseleave: () => any;
    };
    cssForDate(date: any, periodIsDay: any): {
        [x: string]: any;
        "in-range": any;
        highlight: any;
        clickable: boolean;
        "out-of-boundaries": any;
        unavailable: boolean;
    };
    period: any;
    single: any;
    timeZone: any;
    locale: any;
    startDate: any;
    endDate: any;
    isCustomPeriodRangeActive: any;
    type: any;
    label: any;
    hoverDate: import("knockout").Observable<any>;
    activeDate: any;
    currentDate: any;
    inputDate: import("knockout").Computed<any>;
    firstDate: import("knockout").PureComputed<any>;
    lastDate: import("knockout").PureComputed<any>;
    headerView: CalendarHeaderView;
    calendar(): any[];
    weekDayNames(): any;
    firstYearOfDecade(date: any): any;
    lastYearOfDecade(date: any): any;
}
import { CalendarHeaderView } from "./header-view";
