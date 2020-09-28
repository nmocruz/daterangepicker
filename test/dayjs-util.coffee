describe 'DayjsUtil', ->
  DayjsUtil = $.fn.daterangepicker.DayjsUtil
  DateRangePickerView = $.fn.daterangepicker.DateRangePickerView
  calendarView = new DateRangePickerView({}).calendars()[0]
  describe '#setFirstDayOfTheWeek()', ->
    originalFirstDayOfWeek = null
    weekTest = (number, day) ->
      DayjsUtil.setFirstDayOfTheWeek(number)
      assert.equal(dayjs().startOf('week').format('dddd'), day)
      assert.equal(calendarView.weekDayNames()[0], day.substr(0, 2))

    before ->
      originalFirstDayOfWeek = dayjs.localeData().firstDayOfWeek()

    after ->
      DayjsUtil.setFirstDayOfTheWeek(originalFirstDayOfWeek)

    it 'should work when I set it to 5 (Friday)', () ->
      weekTest(5, 'Friday')

    it 'should work when I set it to 1 (Monday)', () ->
      weekTest(1, 'Monday')

    it 'should work when I set it to the same day (Monday)', () ->
      weekTest(1, 'Monday')

    it 'should work with negative numbers', () ->
      weekTest(-1, 'Saturday')
      weekTest(-13, 'Monday')

    it 'should work with numbers > 6', () ->
      weekTest(7, 'Sunday')
      weekTest(8 + 7, 'Monday')
