import $ from 'jquery';

export function daterangepicker(options = {}, callback) {
    $.fn.daterangepicker = function(options, callback) {
      this.each(function() {
        var $element;
        $element = $(this);
        if (!$element.data('daterangepicker')) {
          options.anchorElement = $element;
          if (callback) {
            options.callback = callback;
          }
          options.callback = $.proxy(options.callback, this);
          return $element.data('daterangepicker', new DateRangePickerView(options));
        }
      });
      return this;
    };
}