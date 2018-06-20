import { OnInit } from '@angular/core';
import * as drp from 'knockout-daterangepicker-fb';
export declare class HomeComponent implements OnInit {
    pickerView: drp.DateRangePickerView;
    element: JQuery<HTMLElement>;
    constructor();
    ngOnInit(): void;
}
