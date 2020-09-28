import { Component, OnInit } from '@angular/core';
import { Options, DateRangePickerView } from 'knockout-daterangepicker-fb';

import 'jquery';
declare var $: JQueryStatic;

// const pickerConfig = new Config({
//     standalone: true
// });

const opts = new Options({ standalone: true });

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
    pickerView: DateRangePickerView;
    element: any;

    constructor() {}

    ngOnInit() {
        this.element = $('.daterangepicker-container').daterangepicker(opts);
    }

}
