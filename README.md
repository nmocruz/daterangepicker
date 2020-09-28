[![Build Status](https://travis-ci.org/sensortower/daterangepicker.svg?branch=master)](https://travis-ci.org/sensortower/daterangepicker)
[![Join the chat at https://gitter.im/sensortower/daterangepicker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sensortower/daterangepicker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Github search hit counter](https://img.shields.io/github/search/frost-byte/daterangepicker/goto.svg)](https://github.com/frost-byte/daterangepicker)
[![Analytics](https://ga-beacon.appspot.com/UA-71619034-2/daterangepicker/README?flat)](https://github.com/igrigorik/ga-beacon)

<h1 class="hide-me" id="daterangepicker">daterangepicker</h1>

<p class="hide-me">
<img src="https://sensortower.github.io/daterangepicker/images/demo.gif" alt="Demo screenshot">
</p>
<p class="hide-me">
<a href="https://sensortower.github.io/daterangepicker">Demo available here</a>
</p>

## Notable Features

* Day / Week / Month / Quarter / Year calendar modes
* Single calendar mode
* Customazible & extendable
* Integration with jQuery & Knockout

## Dependencies

* jquery
* day.js
* knockout

## Documentation

[Documentation](https://sensortower.github.io/daterangepicker/docs) & [Examples](https://sensortower.github.io/daterangepicker/examples) are available on our website.

## Download

[Latest Release](https://github.com/sensortower/daterangepicker/releases)

## Install

```bash
bower install knockout-daterangepicker --save
```

## Usage

### With jQuery
```javascript
$("input").daterangepicker({
  minDate: dayjs().subtract(2, 'years'),
  callback: function (startDate, endDate, period) {
    $(this).val(startDate.format('L') + ' – ' + endDate.format('L'));
  }
});
```

### With Knockout.js
```html
<input type="text" data-bind="daterangepicker: dateRange"/>
```

```javascript
ko.applyBindings({
  dateRange: ko.observable([dayjs().subtract(1, 'month'), dayjs()])
});
```


## Development

```bash
git clone git@github.com:sensortower/daterangepicker.git && cd daterangepicker
npm install && bower install
gulp serve
```


<h2 class="hide-me" id="copyright">Copyright</h2>
<p class="hide-me">Copyright © 2015 SensorTower Inc. See LICENSE for further details.</p>
