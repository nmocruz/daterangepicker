export class Period {
    static allPeriods: string[];
    static methods: string[];
    static scale(period: any): "month" | "year";
    static showWeekDayNames(period: any): boolean;
    static nextPageArguments(period: any): (string | number)[];
    static format(period: any): "D" | "MMM" | "\\QQ" | "YYYY";
    static title(period: any, localeObj: any): any;
    static dimentions(period: any): number[];
    static extendObservable(observable: any): any;
}
