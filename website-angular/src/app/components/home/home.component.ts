import { Component, OnInit } from '@angular/core';
import * as drp from 'knockout-daterangepicker-fb';
import 'jquery';
declare var $: JQueryStatic;

declare global {
    interface JQuery {
        daterangepicker(options?: drp.Config) : JQuery;
        data(key: 'daterangepicker') : drp.DateRangePickerView | undefined;
    }
}

const pickerOptions: drp.Config = {
  standalone: true
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
  pickerView: drp.DateRangePickerView;
  element: JQuery<HTMLElement>;

  constructor() {
    this.element = $(".daterangepicker-container").daterangepicker(pickerOptions);
  }

  ngOnInit() {
  }

}
