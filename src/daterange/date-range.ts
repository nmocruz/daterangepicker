export { DateRangePickerView } from './picker-view';
import dayjs, { Dayjs, ConfigType } from 'dayjs';

export type DatePickerCallback = (startDate?: ConfigType, endDate?: ConfigType, period?: string) => void;
export type PickerDate = ConfigType | [string | Dayjs, string] | [Dayjs?, string?];

export interface DateRangeDictionary {
    [title: string]: [string | Dayjs, string | Dayjs] | string | DateRange;
}

export class DateRange {
    title: string;
    startDate: Dayjs;
    endDate: Dayjs;

    constructor(title: string, startDate: ConfigType, endDate: ConfigType) {
        this.title = title;
        this.startDate = dayjs(startDate);
        this.endDate = dayjs(endDate);
    }
}

export class AllTimeDateRange extends DateRange { };
export class CustomDateRange extends DateRange { };