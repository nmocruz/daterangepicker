/// <reference path="../../node_modules/dayjs/locale/index.d.ts" />

export interface Locale {
    applyButtonTitle?: 'Apply',
    cancelButtonTitle?: 'Cancel',
    inputFormat?: 'L',
    startLabel?: 'Start',
    endLabel?: 'End',
    dayLabel?: 'Day',
    weekLabel?: 'Week',
    monthLabel?: 'Month',
    quarterLabel?: 'Quarter',
    yearLabel?: 'Year',
    meridiem?(hour: number, minute: number, isLowerCase: boolean): string
}

export type ExtendedLocale = Partial<ILocale> & Locale;