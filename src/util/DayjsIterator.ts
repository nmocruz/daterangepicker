import { Dayjs, OpUnitType } from 'dayjs';

export class DayjsIterator {
    date: Dayjs;
    period: OpUnitType;

    constructor(date: Dayjs, period: OpUnitType) {
        this.date = date.clone();
        this.period = period;
    }

    static array(date: Dayjs, amount: number, period: OpUnitType): Array<Dayjs> {
        var i, l, ref1, results;
        let iterator = new DayjsIterator(date, period);
        results = [];
        for (i = l = 0, ref1 = amount - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
            results.push(iterator.next());
        }
        return results;
    }

    next(): Dayjs {
        let nextDate = this.date;
        this.date = nextDate.clone().add(1, this.period);
        return nextDate.clone();
    }
}