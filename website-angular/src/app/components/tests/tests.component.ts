import { Component, OnInit } from '@angular/core';
import * as chai from 'chai';
import { doTests } from './array-utils.spec';

@Component({
    selector: 'app-tests',
    templateUrl: 'tests.component.html',
    styleUrls: ['tests.component.scss']
})
export class TestsComponent implements OnInit {
    // myMocha: Mocha;
    constructor() { }

    async loadTests() {
        if ( mocha !== null ) {
            import('./array-utils.spec')
                .then((module) => module.doTests());
            const config = await import('./config.spec');
            const pickerView = await import('./date-range-picker-view.spec');
            const dayjsIterator = await import('./dayjs-iterator.spec');
            const dayjsUtil = await import('./dayjs-util.spec');
            const periodTest = await import('./period.spec');

            config.doTests();
            pickerView.doTests();
            dayjsIterator.doTests();
            dayjsUtil.doTests();
            periodTest.doTests();
            mocha.run();
        }
    }

    ngOnInit() {
        this.loadTests();
    }

}
