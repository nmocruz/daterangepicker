import { Component, OnInit } from '@angular/core';
import { DateRangePickerView, Config, Options } from 'knockout-daterangepicker-fb';

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
