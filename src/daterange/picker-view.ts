import { Config, Period } from '../config/config';
import { CalendarView } from '../calendar/calendar';
import { CustomDateRange } from './date-range';
import {
    applyBindings,
    observable
} from 'knockout';

export class DateRangePickerView extends Config {
    constructor(options = {}) {
        var endDate, startDate, wrapper;
        this.setDateRange = this.setDateRange.bind(this);
        this.setCustomPeriodRange = this.setCustomPeriodRange.bind(this);
        this.outsideClick = this.outsideClick.bind(this);
        new Config(options).extend(this);
        this.startCalendar = new CalendarView(this, this.startDate, 'start');
        this.endCalendar = new CalendarView(this, this.endDate, 'end');
        this.startDateInput = this.startCalendar.inputDate;
        this.endDateInput = this.endCalendar.inputDate;
        this.dateRange = observable([this.startDate(), this.endDate()]);
        this.startDate.subscribe((newValue) => {
            if (this.single()) {
                this.endDate(newValue.clone().endOf(this.period()));
                this.updateDateRange();
                return this.close();
            } else {
                if (this.endDate().isSame(newValue)) {
                    this.endDate(this.endDate().clone().endOf(this.period()));
                }
                if (this.standalone()) {
                    return this.updateDateRange();
                }
            }
        });
        this.endDate.subscribe((newValue) => {
            if (!this.single() && this.standalone()) {
                return this.updateDateRange();
            }
        });
        this.style = observable({});
        if (this.callback) {
            this.dateRange.subscribe((newValue) => {
                var endDate, startDate;
                [startDate, endDate] = newValue;
                return this.callback(startDate.clone(), endDate.clone(), this.period(), this.startCalendar.firstDate(), this.endCalendar.lastDate());
            });
            this.startCalendar.firstDate.subscribe((newValue) => {
                var endDate, startDate;
                [startDate, endDate] = this.dateRange();
                return this.callback(startDate.clone(), endDate.clone(), this.period(), newValue, this.endCalendar.lastDate());
            });
            this.endCalendar.lastDate.subscribe((newValue) => {
                var endDate, startDate;
                [startDate, endDate] = this.dateRange();
                return this.callback(startDate.clone(), endDate.clone(), this.period(), this.startCalendar.firstDate(), newValue);
            });
            if (this.forceUpdate) {
                [startDate, endDate] = this.dateRange();
                this.callback(startDate.clone(), endDate.clone(), this.period(), this.startCalendar.firstDate(), this.endCalendar.lastDate());
            }
        }
        if (this.anchorElement) {
            wrapper = $("<div data-bind=\"stopBinding: true\"></div>").appendTo(this.parentElement);
            this.containerElement = $(this.constructor.template).appendTo(wrapper);
            applyBindings(this, this.containerElement.get(0));
            this.anchorElement.click(() => {
                this.updatePosition();
                return this.toggle();
            });
            if (!this.standalone()) {
                $(document).on('mousedown.daterangepicker', this.outsideClick).on('touchend.daterangepicker', this.outsideClick).on('click.daterangepicker', '[data-toggle=dropdown]', this.outsideClick).on('focusin.daterangepicker', this.outsideClick);
            }
        }
        if (this.opened()) {
            this.updatePosition();
        }
    }
    static periodProxy = Period;

    getLocale() {
        return this.locale;
    }

    calendars() {
        if (this.single()) {
            return [this.startCalendar];
        } else {
            return [this.startCalendar, this.endCalendar];
        }
    }

    updateDateRange() {
        return this.dateRange([this.startDate(), this.endDate()]);
    }

    cssClasses() {
        var i, len, obj, period, ref;
        obj = {
            single: this.single(),
            opened: this.standalone() || this.opened(),
            expanded: this.standalone() || this.single() || this.expanded(),
            standalone: this.standalone(),
            'hide-weekdays': this.hideWeekdays(),
            'hide-periods': (this.periods().length + this.customPeriodRanges.length) === 1,
            'orientation-left': this.orientation() === 'left',
            'orientation-right': this.orientation() === 'right'
        };
        ref = Period.allPeriods;
        for (i = 0, len = ref.length; i < len; i++) {
            period = ref[i];
            obj[`${period}-period`] = period === this.period();
        }
        return obj;
    }

    isActivePeriod(period: string): boolean {
        return this.period() === period;
    }

    isActiveDateRange(dateRange) {
        var dr, i, len, ref;
        if (dateRange.constructor === CustomDateRange) {
            ref = this.ranges;
            for (i = 0, len = ref.length; i < len; i++) {
                dr = ref[i];
                if (dr.constructor !== CustomDateRange && this.isActiveDateRange(dr)) {
                    return false;
                }
            }
            return true;
        } else {
            return this.startDate().isSame(dateRange.startDate, 'day') && this.endDate().isSame(dateRange.endDate, 'day');
        }
    }

    isActiveCustomPeriodRange(customPeriodRange) {
        return this.isActiveDateRange(customPeriodRange) && this.isCustomPeriodRangeActive();
    }

    inputFocus() {
        return this.expanded(true);
    }

    setPeriod(period) {
        this.isCustomPeriodRangeActive(false);
        this.period(period);
        return this.expanded(true);
    }

    setDateRange(dateRange) {
        if (dateRange.constructor === CustomDateRange) {
            return this.expanded(true);
        } else {
            this.expanded(false);
            this.close();
            this.period('day');
            this.startDate(dateRange.startDate);
            this.endDate(dateRange.endDate);
            return this.updateDateRange();
        }
    }

    setCustomPeriodRange(customPeriodRange) {
        this.isCustomPeriodRangeActive(true);
        return this.setDateRange(customPeriodRange);
    }

    applyChanges() {
        this.close();
        return this.updateDateRange();
    }

    cancelChanges() {
        return this.close();
    }

    open() {
        return this.opened(true);
    }

    close() {
        if (!this.standalone()) {
            return this.opened(false);
        }
    }

    toggle() {
        if (this.opened()) {
            return this.close();
        } else {
            return this.open();
        }
    }

    updatePosition() {
        var parentOffset, parentRightEdge, style;
        if (this.standalone()) {
            return;
        }
        parentOffset = {
            top: 0,
            left: 0
        };
        parentRightEdge = $(window).width();
        if (!this.parentElement.is('body')) {
            parentOffset = {
                top: this.parentElement.offset().top - this.parentElement.scrollTop(),
                left: this.parentElement.offset().left - this.parentElement.scrollLeft()
            };
            parentRightEdge = this.parentElement.get(0).clientWidth + this.parentElement.offset().left;
        }
        style = {
            top: (this.anchorElement.offset().top + this.anchorElement.outerHeight() - parentOffset.top) + 'px',
            left: 'auto',
            right: 'auto'
        };
        switch (this.orientation()) {
            case 'left':
                if (this.containerElement.offset().left < 0) {
                    style.left = '9px';
                } else {
                    style.right = (parentRightEdge - (this.anchorElement.offset().left) - this.anchorElement.outerWidth()) + 'px';
                }
                break;
            default:
                if (this.containerElement.offset().left + this.containerElement.outerWidth() > $(window).width()) {
                    style.right = '0';
                } else {
                    style.left = (this.anchorElement.offset().left - parentOffset.left) + 'px';
                }
        }
        return this.style(style);
    }

    outsideClick(event) {
        var target;
        target = $(event.target);
        if (!(event.type === 'focusin' || target.closest(this.anchorElement).length || target.closest(this.containerElement).length || target.closest('.calendar').length)) {
            return this.close();
        }
    }

    static template = `
    <div class="daterangepicker" data-bind="css: $data.cssClasses(), style: $data.style()">
        <div class="controls">
            <ul class="periods">
                <!-- ko foreach: $data.periods -->
                <li class="period" data-bind="css: {active: $parent.isActivePeriod($data) && !$parent.isCustomPeriodRangeActive()}, text: $parent.periodProxy.title($data, $parent.getLocale()), click: function(){ $parent.setPeriod($data); }"></li>
                <!-- /ko -->
                <!-- ko foreach: $data.customPeriodRanges -->
                <li class="period" data-bind="css: {active: $parent.isActiveCustomPeriodRange($data)}, text: $data.title, click: function(){ $parent.setCustomPeriodRange($data); }"></li>
                <!-- /ko -->
            </ul>
            <ul class="ranges" data-bind="foreach: $data.ranges">
                <li class="range" data-bind="css: {active: $parent.isActiveDateRange($data)}, text: $data.title, click: function(){ $parent.setDateRange($data); }"></li>
            </ul>
            <form data-bind="submit: $data.applyChanges">
                <div class="custom-range-inputs">
                    <input type="text" data-bind="value: $data.startDateInput, event: {focus: $data.inputFocus}" />
                    <input type="text" data-bind="value: $data.endDateInput, event: {focus: $data.inputFocus}" />
                </div>
                <div class="custom-range-buttons">
                    <button class="apply-btn" type="submit" data-bind="text: $data.locale.applyButtonTitle, click: $data.applyChanges"></button>
                    <button class="cancel-btn" data-bind="text: $data.locale.cancelButtonTitle, click: $data.cancelChanges"></button>
                </div>
            </form>
        </div>

        <!-- ko foreach: $data.calendars() -->
        <div class="calendar">
            <div class="calendar-title" data-bind="text: $data.label"></div>
            <div class="calendar-header" data-bind="with: $data.headerView">
                <div class="arrow" data-bind="css: $data.prevArrowCss()">
                    <button data-bind="click: $data.clickPrevButton"><span class="arrow-left"></span></button>
                </div>
                <div class="calendar-selects">
                    <select class="month-select" data-bind="options: $data.monthOptions(), optionsText: $data.monthFormatter, valueAllowUnset: true, value: $data.selectedMonth, fireChange: true, css: {hidden: !$data.monthSelectorAvailable()}"></select>
                    <select class="year-select" data-bind="options: $data.yearOptions(), optionsText: $data.yearFormatter, valueAllowUnset: true, value: $data.selectedYear, fireChange: true, css: {hidden: !$data.yearSelectorAvailable()}"></select>
                    <select class="decade-select" data-bind="options: $data.decadeOptions(), optionsText: $data.decadeFormatter, valueAllowUnset: true, value: $data.selectedDecade, fireChange: true, css: {hidden: !$data.decadeSelectorAvailable()}"></select>
                </div>
                <div class="arrow" data-bind="css: $data.nextArrowCss()">
                    <button data-bind="click: $data.clickNextButton"><span class="arrow-right"></span></button>
                </div>
            </div>
            <div class="calendar-table">
                <!-- ko if: $parent.periodProxy.showWeekDayNames($data.period()) -->
                <div class="table-row weekdays" data-bind="foreach: $data.weekDayNames()">
                    <div class="table-col">
                        <div class="table-value-wrapper">
                            <div class="table-value" data-bind="text: $data"></div>
                        </div>
                    </div>
                </div>
                <!-- /ko -->
                <!-- ko foreach: $data.calendar() -->
                <div class="table-row" data-bind="foreach: $data">
                    <div class="table-col" data-bind="event: $parents[1].eventsForDate($data), css: $parents[1].cssForDate($data)">
                        <div class="table-value-wrapper" data-bind="foreach: $parents[1].tableValues($data)">
                            <div class="table-value" data-bind="html: $data.html, css: $data.css"></div>
                        </div>
                    </div>
                </div>
                <!-- /ko -->
            </div>
        </div>
        <!-- /ko -->
    </div>
    `

};
