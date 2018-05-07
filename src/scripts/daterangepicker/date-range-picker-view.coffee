class DateRangePickerView
  constructor: (options = {}) ->
    new Config(options).extend(@)
    @startCalendar = new CalendarView(@, @startDate, 'start')
    @endCalendar = new CalendarView(@, @endDate, 'end')

    @fromLabel = 'From'
    @toLabel = 'To'

    @quickPeriodsRanges = [
      {
        label: 'Today'
        range : [
          moment.utc().startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label: 'Yesterday'
        range : [
          moment.utc().subtract(1, 'day').startOf('day'),
          moment.utc().subtract(1, 'day').endOf('day')
        ]
      }
      {
        label: 'Previous week'
        range : [
          moment.utc().subtract(1, 'week').startOf('week').startOf('day'),
          moment.utc().subtract(1, 'week').endOf('week').endOf('day')
        ]
      }
      {
        label : 'Previous month'
        range : [
          moment.utc().subtract(1, 'months').startOf('month').startOf('day'),
          moment.utc().subtract(1, 'months').endOf('month').endOf('day')
        ]
      }
      {
        label : 'Previous year'
        range : [
          moment.utc().subtract(1, 'year').startOf('year').startOf('day'),
          moment.utc().subtract(1, 'year').endOf('year').endOf('day')
        ]
      }
      {
        label : 'Last 15 minutes'
        range : [
          moment.utc().subtract(15, 'minutes'),
          moment.utc()
        ]
      }
      {
        label : 'Last 30 minutes'
        range : [
          moment.utc().subtract(30, 'minutes'),
          moment.utc()
        ]
      }
      {
        label : 'Last 1 hour'
        range : [
          moment.utc().subtract(1, 'hour'),
          moment.utc()
        ]
      }
      {
        label : 'Last 4 hours'
        range : [
          moment.utc().subtract(4, 'hours'),
          moment.utc()
        ]
      }
      {
        label : 'Last 12 hours'
        range : [
          moment.utc().subtract(12, 'hours'),
          moment.utc()
        ]
      }
      {
        label : 'Last 24 hours'
        range : [
          moment.utc().subtract(12, 'hours'),
          moment.utc()
        ]
      }
      {
        label : 'Last 7 days'
        range : [
          moment.utc().subtract(7, 'days').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 30 days'
        range : [
          moment.utc().subtract(30, 'days').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 60 days'
        range : [
          moment.utc().subtract(60, 'days').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 90 days'
        range : [
          moment.utc().subtract(90, 'days').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 6 months'
        range : [
          moment.utc().subtract(6, 'months').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 1 year'
        range : [
          moment.utc().subtract(1, 'year').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 2 years'
        range : [
          moment.utc().subtract(2, 'years').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
      {
        label : 'Last 5 years'
        range : [
          moment.utc().subtract(5, 'years').startOf('day'),
          moment.utc().endOf('day')
        ]
      }
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

    @showQuick()

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
    date = @quickPeriodsRanges[index()]['range']
    @isTimeDependant(@quickPeriodsRanges[index()]['timeDependant'])
    startDate = date[0]
    endDate = date[1]
    title = startDate.format(@locale.inputFormat) + ' - ' + endDate.format(@locale.inputFormat)
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
