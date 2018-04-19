class DateRangePickerView
  constructor: (options = {}) ->
    new Config(options).extend(@)

    @startCalendar = new CalendarView(@, @startDate, 'start')
    @endCalendar = new CalendarView(@, @endDate, 'end')

    @fromLabel = 'From'
    @toLabel = 'To'

    @quickPeriodsLabel = [
      'Previous week'
      'Previous month'
      'Previous year'
      'Last 7 days'
      'Last 30 days'
      'Last 60 days'
      'Last 90 days'
      'Last 6 months'
      'Last 1 year'
      'Last 2 year'
      'Last 5 year'
    ]

    @quickPeriodsDates = [
      [moment().subtract(1, 'week'), moment()],
      [moment().subtract(1, 'months'), moment()],
      [moment().subtract(1, 'year'), moment()],
      [moment().subtract(7, 'days'), moment()],
      [moment().subtract(30, 'days'), moment()],
      [moment().subtract(60, 'days'), moment()],
      [moment().subtract(90, 'days'), moment()],
      [moment().subtract(6, 'months'), moment()],
      [moment().subtract(1, 'year'), moment()],
      [moment().subtract(2, 'years'), moment()],
      [moment().subtract(5, 'years'), moment()]
    ]

    @startDateInput = @startCalendar.inputDate
    @endDateInput = @endCalendar.inputDate
    @range = null
    @dateRange = ko.observable([@startDate(), @endDate()])

    @startDate.subscribe (newValue) =>
      if @single()
        @endDate(newValue.clone().endOf(@period()))
        @updateDateRange()
        @close()
      else
        if @endDate().isSame(newValue)
          @endDate(@endDate().clone().endOf(@period()))
        if @standalone()
          @updateDateRange()

    @endDate.subscribe (newValue) =>
      if not @single() and @standalone()
        @updateDateRange()

    @style = ko.observable({})

    if @callback
      @dateRange.subscribe (newValue) =>
        [startDate, endDate] = newValue
        startDate.hours(0)
        startDate.minutes(0)
        startDate.seconds(0)

        endDate.hours(23)
        endDate.minutes(59)
        endDate.seconds(59)
        @callback(startDate.clone(), endDate.clone(), @period(), @range, @startCalendar.firstDate(),
                  @endCalendar.lastDate())
      @startCalendar.firstDate.subscribe (newValue) =>
        [startDate, endDate] = @dateRange()
        @callback(startDate.clone(), endDate.clone(), @period(), @range, newValue,
                  @endCalendar.lastDate())
      @endCalendar.lastDate.subscribe (newValue) =>
        [startDate, endDate] = @dateRange()
        @callback(startDate.clone(), endDate.clone(), @period(), @range, @startCalendar.firstDate(),
                  newValue)
      if @forceUpdate
        [startDate, endDate] = @dateRange()

        @callback(startDate.clone(), endDate.clone(), @period(), @range, @startCalendar.firstDate(),
                  @endCalendar.lastDate())

    if @anchorElement
      wrapper = $("<div data-bind=\"stopBinding: true\"></div>").appendTo(@parentElement)
      @containerElement = $(@constructor.template).appendTo(wrapper)
      ko.applyBindings(@, @containerElement.get(0))
      @anchorElement.click =>
        @updatePosition()
        @toggle()
      unless @standalone()
        $(document)
          .on('mousedown.daterangepicker', @outsideClick)
          .on('touchend.daterangepicker', @outsideClick)
          .on('click.daterangepicker', '[data-toggle=dropdown]', @outsideClick)
          .on('focusin.daterangepicker', @outsideClick)

    if @opened()
      @updatePosition()

  showQuick: () ->
    @isShowingQuick(true)

  hideQuick: () ->
    @isShowingQuick(false)


  periodProxy: Period

  getLocale: () ->
    @locale

  calendars: () ->
    if @single()
      [@startCalendar]
    else
      [@startCalendar, @endCalendar]

  getStartDateInput: () ->
    @startDateInput

  getEndDateInput: () ->
    @endDateInput

  dateInput: (index) ->
    if index() == 0
      @getStartDateInput()
    else
      @getEndDateInput()

  getFromLabel: () ->
    @fromLabel

  getToLabel: () ->
    @toLabel

  getCalendarLabel : (index) ->
    if index() == 0
      @getFromLabel()
    else
      @getToLabel()

  updateDateRange: () ->
    @dateRange([@startDate(), @endDate()])

  cssClasses: () ->
    obj = {
      single: @single()
      opened: @standalone() || @opened()
      expanded: @standalone() || @single() || @expanded() || @isShowingQuick()
      standalone: @standalone()
      'hide-weekdays': @hideWeekdays()
      'hide-periods': (@periods().length + @customPeriodRanges.length) == 1
      'orientation-left': @orientation() == 'left'
      'orientation-right': @orientation() == 'right'
    }
    for period in Period.allPeriods
      obj["#{period}-period"] = period == @period()
    obj

  isActivePeriod: (period) ->
    @period() == period

  isActiveDateRange: (dateRange) ->
    if dateRange.constructor == CustomDateRange
      for dr in @ranges
        if dr.constructor != CustomDateRange && @isActiveDateRange(dr)
          return false
      true
    else
      @startDate().isSame(dateRange.startDate, 'day') && @endDate().isSame(dateRange.endDate, 'day')

  isActiveCustomPeriodRange: (customPeriodRange) ->
    @isActiveDateRange(customPeriodRange) && @isCustomPeriodRangeActive()

  inputFocus: () ->
    @expanded(true)

  setPeriod: (period) ->
    @isCustomPeriodRangeActive(false)
    @hideQuick()
    @period(period)
    @expanded(true)

  setQuickPeriodSelected: (index) ->
    @quickPeriodSelected(index())

  isQuickPeriodSelected: (index) ->
    return @quickPeriodSelected() == index()

  setQuickDateRange: (index) ->
    @setQuickPeriodSelected(index)
    date = @quickPeriodsDates[index()]
    startDate = date[0]
    endDate = date[1]
    title = startDate.format('MM/DD/YYYY') + ' - ' + endDate.format('MM/DD/YYYY')
    @setDateRange(new DateRange(title, startDate, endDate))

  setDateRange: (dateRange) =>
    if dateRange.constructor == CustomDateRange
      @expanded(true)
      @range = null
    else
      @expanded(false)
      @close()
      @period('day')
      @range = dateRange.title
      @startDate(dateRange.startDate)
      @endDate(dateRange.endDate)
      @updateDateRange()

  setCustomPeriodRange: (customPeriodRange) =>
    @isCustomPeriodRangeActive(true)
    @setDateRange(customPeriodRange)

  applyChanges: () ->
    @close()
    @range = null
    @updateDateRange()

  cancelChanges: () ->
    @close()

  open: () ->
    @opened(true)

  close: () ->
    @opened(false) unless @standalone()

  toggle: () ->
    if @opened() then @close() else @open()

  updatePosition: () ->
    return if @standalone()
    parentOffset =
      top: 0
      left: 0
    parentRightEdge = $(window).width()
    if !@parentElement.is('body')
      parentOffset =
        top: @parentElement.offset().top - @parentElement.scrollTop()
        left: @parentElement.offset().left - @parentElement.scrollLeft()
      parentRightEdge = @parentElement.get(0).clientWidth + @parentElement.offset().left

    style =
      top: (@anchorElement.offset().top + @anchorElement.outerHeight() - (parentOffset.top)) + 'px'
      left: 'auto'
      right: 'auto'

    switch @orientation()
      when 'left'
        if @containerElement.offset().left < 0
          style.left = '9px'
        else
          style.right = (parentRightEdge - (@anchorElement.offset().left) -
                        @anchorElement.outerWidth()) + 'px'
      else
        if @containerElement.offset().left + @containerElement.outerWidth() > $(window).width()
          style.right = '0'
        else
          style.left = (@anchorElement.offset().left - (parentOffset.left)) + 'px'

    @style(style)

  outsideClick: (event) =>
    target = $(event.target)
    unless event.type == 'focusin' || target.closest(@anchorElement).length ||
           target.closest(@containerElement).length || target.closest('.calendar').length
      @close()
