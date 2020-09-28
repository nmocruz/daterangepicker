import {
    bindingHandlers,
    virtualElements,
    unwrap,
    ignoreDependencies
} from 'knockout';
import dayjs from 'dayjs';
import $ from 'jquery';

bindingHandlers.stopBinding = {
    init: function () {
        return {
            controlsDescendantBindings: true
        };
    }
};

virtualElements.allowedBindings.stopBinding = true;

bindingHandlers.daterangepicker = (function () {
    return $.extend(this, {
        _optionsKey: 'daterangepickerOptions',
        _formatKey: 'daterangepickerFormat',
        init: function (element, valueAccessor, allBindings) {
            var observable, options;
            observable = valueAccessor();
            options = unwrap(allBindings.get(this._optionsKey)) || {};
            return $(element).daterangepicker(options, function (startDate, endDate, period) {
                return observable([startDate, endDate]);
            });
        },
        update: function (element, valueAccessor, allBindings) {
            var $element, dateFormat, endDate, endDateText, startDate, startDateText;
            $element = $(element);
            [startDate, endDate] = valueAccessor()();
            dateFormat = unwrap(allBindings.get(this._formatKey)) || 'MMM D, YYYY';
            startDateText = dayjs(startDate).format(dateFormat);
            endDateText = dayjs(endDate).format(dateFormat);
            return ignoreDependencies(function () {
                var text;
                if (!$element.data('daterangepicker').standalone()) {
                    text = $element.data('daterangepicker').single() ? startDateText : `${startDateText} – ${endDateText}`;
                    $element.val(text).text(text);
                }
                $element.data('daterangepicker').startDate(startDate);
                $element.data('daterangepicker').endDate(endDate);
            });
        }
    });
})();

bindingHandlers.fireChange = {
    update: function (element, valueAccessor, allBindings) {
        var selectorValue;
        selectorValue = unwrap(allBindings.get('value'));
        if (selectorValue) {
            return $(element).on('change');
        }
    }
};