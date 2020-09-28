import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import minMax from 'dayjs/plugin/minMax';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en';

dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);
dayjs.extend(weekday);
dayjs.extend(minMax);
dayjs.extend(utc);
dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.extend(timezone);
dayjs.locale('en');

