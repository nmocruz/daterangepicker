export { DateRangePickerView } from "./picker-view";
export class DateRange {
    constructor(title: any, startDate: any, endDate: any);
    title: any;
    startDate: any;
    endDate: any;
}
export class AllTimeDateRange extends DateRange {
    constructor(title: any, startDate: any, endDate: any);
}
export class CustomDateRange extends DateRange {
    constructor(title: any, startDate: any, endDate: any);
}
