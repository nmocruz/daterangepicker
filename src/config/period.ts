import { observable, Observable as KnockoutObservable } from 'knockout';

export type PeriodTypes = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface PeriodInterface {
    type?: PeriodTypes | string;
    scale(): string;
    showWeekDayNames(): boolean;
    nextPageArguments(): [number, string];
    format(): string;
    title(): string;
    dimentions(): [number, number];
}

export class Period implements PeriodInterface {
    static allPeriods: Array<PeriodTypes> = ['day', 'week', 'month', 'quarter', 'year'];
    static methods = ['scale', 'showWeekDayNames', 'nextPageArguments', 'format', 'title', 'dimentions'];
    type: PeriodTypes;

    constructor(type: PeriodTypes) {
        this.type = type;
    }

    scale(): string {
        return Period._scale(this.type);
    }

    showWeekDayNames(): boolean {
        return Period._showWeekDayNames(this.type);
    }

    nextPageArguments(): [number, string] {
        return Period._nextPageArguments(this.type);
    }

    format(): string {
        return Period._format(this.type);
    }

    title(): string {
        return Period._title(this.type);
    }

    dimentions(): [number, number] {
        return Period._dimentions(this.type);
    }

    static _scale(period: PeriodTypes): string {
        if (period === 'day' || period === 'week') {
            return 'month';
        } else {
            return 'year';
        }
    }

    static _showWeekDayNames(period: PeriodTypes): boolean {
        if (period === 'day' || period === 'week') {
            return true;
        } else {
            return false;
        }
    }

    static _nextPageArguments(period: PeriodTypes = 'week'): [number, string] {
        let amount: number = period === 'year' ? 9 : 1;
        let scale: string = this._scale(period);
        return [amount, scale];
    }

    static _format(period: PeriodTypes): string {
        switch (period) {
            case 'month':
                return 'MMM';
            case 'quarter':
                return '\\QQ';
            case 'year':
                return 'YYYY';
            case 'day':
            case 'week':
            default:
                return 'D';
        }
    }

    static _title(period: PeriodTypes = 'day'): string {
        let name = (period as string);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return name;
    }

    static _dimentions(period: PeriodTypes): [number, number] {
        switch (period) {
            case 'day':
                return [7, 6];
            case 'month':
                return [3, 4];
            case 'quarter':
                return [2, 2];
            case 'year':
                return [3, 3];
            case 'week':
            default:
                return [1, 6];
        }
    }

    static extendObservable(type: PeriodTypes): KnockoutObservable<Period> {
        return observable(new Period(type));
    }
}