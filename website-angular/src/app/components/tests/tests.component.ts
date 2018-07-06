import { Component, OnInit } from '@angular/core';
import * as chai from 'chai';

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
            const array_utils = await import('./array-utils.spec');
            const config = await import('./config.spec');
            const pickerView = await import('./date-range-picker-view.spec');
            const momentIterator = await import('./moment-iterator.spec');
            const momentUtil = await import('./moment-util.spec');
            const periodTest = await import('./period.spec');

            array_utils.doTests();
            config.doTests();
            pickerView.doTests();
            momentIterator.doTests();
            momentUtil.doTests();
            periodTest.doTests();
            mocha.run();
        }
    }

    ngOnInit() {
        this.loadTests();
    }

}
