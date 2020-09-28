import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timeZone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import { ExtendedLocale } from "../config/locale";
import { ConfigType, OptionType, Dayjs } from 'dayjs';

dayjs.extend(customParseFormat);
dayjs.extend(timeZone);
dayjs.extend(utc);
dayjs.extend(updateLocale)
dayjs.extend(localeData);
dayjs.extend(weekday);

export interface TimeZoneOptions {
  date: ConfigType;
  format?: OptionType;
  timeZone: string;
}

export class DayjsUtil {
    static patchCurrentLocale(obj: ExtendedLocale): ExtendedLocale {
        return dayjs.updateLocale(dayjs.locale(), obj);
    }

    static setFirstDayOfTheWeek(dow: number): ExtendedLocale | undefined {
        let firstdow: number = dayjs().localeData().firstDayOfWeek();

        dow = ((dow % 7) + 7) % 7;

        if (firstdow !== dow) {
            return this.patchCurrentLocale({
                weekStart: dow
            });
        }
        return dayjs().localeData();
    }

    /**
     * 
     * @param args can be (date?: ConfigType, format?: OptionType, timeZone?: string): Dayjs
     */
    static tz(options: TimeZoneOptions): Dayjs {
        let {date, format, timeZone }: {date: ConfigType, format?: OptionType, timeZone: string} = options;
        let result = dayjs(date, format);
        let tzFormat: string | undefined;

        if (typeof format == 'string') {
            tzFormat = format;
        }
        if (Array.isArray(format) && format.length) {
            tzFormat = format[0];
        }

        if (dayjs.tz) {
            return result = dayjs.tz(result, timeZone);
        } else if (timeZone && timeZone.toLowerCase() === "utc") {
            return dayjs.utc(result, tzFormat);
        } else {
            return result;
        }
    }
}