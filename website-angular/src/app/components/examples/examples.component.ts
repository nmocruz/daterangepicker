import { Component, OnInit, DoCheck, AfterViewInit, AfterContentInit, QueryList, ViewChild, Directive, ElementRef } from '@angular/core';
import * as ko from 'knockout';
import { Observable } from 'knockout';
import dayjs from 'dayjs';
import { Options, DateRange, DateRangePickerView } from 'knockout-daterangepicker-fb';


declare var $: any;

@Directive({selector: 'markdown'})
export class ChildDirective {
    pickerViews: DateRangePickerView[] = new Array<DateRangePickerView>();

    constructor(private el: ElementRef) {
    }

    getElement(): ElementRef {
        return this.el;
    }


    getChildren(): any[] {
        return this.el.nativeElement.children;
    }

    hasChildren(): boolean {
        return this.el.nativeElement.children.length > 0;
    }

    logChildren() {
        const children: any[] = Array.from(this.getChildren());

        for (let i = 0; i < children.length; i++) {
            console.log(children[i]);
        }
    }

    createPickers() {
        const preElements = Array.from(this.getChildren()).filter(el => el.tagName.includes('PRE'));
        console.log('createPickers');
        console.log(preElements);

        for (const el of preElements) {
            const nodeType = (el.lastChild.className.includes('language-html')) ? 'div' : 'script';

            if (nodeType === 'script') {
                // const reg = /\$\("(.*)"\)/i;
                // const matches = el.lastChild.innerText.match(reg);
                //
                // if (matches && matches.length > 1) {
                //     const elClass = matches[1];
                // }
                $('.daterangepicker-field').daterangepicker(
                    new Options({
                        forceUpdate: true,
                        callback: function(startDate, endDate, period) {
                            const title = startDate.format('L') + ' – ' + endDate.format('L');
                            $(this).val(title);
                        }
                    })
                );
                continue;
            }
            console.log(`code: ${el.textContent}; nodeType: ${nodeType}`);

            // The h2 element before the pre element containing the daterange picker
            const prevElement = el.previousElementSibling;

            // The Wrapper element that will contain a new daterange picker element
            // plus the pre element
            const wrapperDiv = document.createElement('div');
            wrapperDiv.classList.add('example-wrapper');

            // The nested div elements that will contain the daterange picker element
            // Will be the first element in the new wrapper div, placed before the existing pre
            // element, which will be moved into the wrapper as the second element
            const newDiv = document.createElement('div');

            // Will be an inner div or script of the new div element above.
            const innerDiv = document.createElement(nodeType);
            innerDiv.classList.add('inner-wrapper');

            // Set the text from the pre element as the inner html for the inner div
            innerDiv.innerHTML = el.textContent;

            // Insert the inner div into the new div
            // newDiv.insertAdjacentElement('afterbegin', innerDiv);

            // Insert the new div into the wrapper
            wrapperDiv.insertAdjacentElement('afterbegin', innerDiv);

            // Place the pre element as the last element in the wrapper div
            wrapperDiv.insertAdjacentElement('beforeend', el);

            // Now reinsert the wrapper after the pre element's original
            // previous sibling (the h2)
            prevElement.insertAdjacentElement('afterend', wrapperDiv);
        }
    }

    filterPre(): any[] {
        const preElements = [];
        const children: HTMLElement[] = Array.from(this.getChildren());
        for (const child of children) {
            console.log(child.className);
            if (child.classList.contains('language-html') || child.tagName.includes('PRE')) {

                preElements.push(child);
            }
        }

        return preElements;
    }
}

interface DatesContainer {
    dateRange?: Observable<dayjs.Dayjs[]>;
    dateRange2?: Observable<dayjs.Dayjs[]>;
    dateRange3?: Observable<dayjs.Dayjs[]>;
    dateRange4?: Observable<dayjs.Dayjs[]>;
    dateRange5?: Observable<dayjs.Dayjs[]>;
}

class DatesView implements DatesContainer {
    dateRange = ko.observable([dayjs().subtract(29, 'day'), dayjs()]);
    dateRange2 = ko.observable([dayjs().subtract(29, 'day'), dayjs()]);
    dateRange3 = ko.observable([dayjs().subtract(29, 'day'), dayjs()]);
    dateRange4 = ko.observable([dayjs().subtract(29, 'day'), dayjs()]);
    dateRange5 = ko.observable([dayjs().subtract(29, 'day'), dayjs()]);

    drpView: DateRangePickerView;
    drpView2: DateRangePickerView;
    drpView3: DateRangePickerView;
    drpView4: DateRangePickerView;
    drpView5: DateRangePickerView;

    constructor() { }
}


@Component({
  selector: 'app-examples',
  templateUrl: 'examples.component.html',
  styleUrls: ['examples.component.scss']
})
export class ExamplesComponent implements OnInit, AfterViewInit, AfterContentInit, DoCheck {
    @ViewChild(ChildDirective) markdownElement: ChildDirective;
    pickersCreated = false;
    datesView: DatesView = new DatesView();

    constructor() { }

    logElement() {
        if (!this.markdownElement.hasChildren()) {
            return;
        }

        console.log(this.markdownElement);
        console.log('getChildren');
        const chitlins = this.markdownElement.getChildren();
        console.log(chitlins);
        console.log(typeof chitlins);
        console.log(chitlins['0']);
        console.log(Array.from(chitlins).length);
        console.log('filterPre');
        console.log(this.markdownElement.filterPre());
        console.log('Logging Children');

        for (let i = 0; i < chitlins.length; i++) {
            console.log(chitlins[i]);
        }
        this.markdownElement.logChildren();
    }
    ngAfterViewInit() {
        console.log('AfterViewInit');
        this.logElement();
    }

    ngAfterContentInit() {
        console.log('AfterContentInit');
        this.logElement();
    }

    ngDoCheck() {
        console.log('DoCheck');
        // this.logElement();

        if (this.markdownElement.hasChildren() && !this.pickersCreated) {
            this.pickersCreated = true;
            this.markdownElement.createPickers();
            const sectionElement = document.getElementById('exampleSection');
            ko.applyBindings(this.datesView, sectionElement);
            return;
        }
    }

    ngOnInit() {
    }

}
