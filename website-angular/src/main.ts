import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import $ from 'jquery';
import './assets/styles/styles.scss';
import * as mocha from 'mocha/mocha';
import * as dayjs from 'dayjs';

// declare var mocha: any;

if (environment.production) {
  enableProdMode();
}

if (mocha !== null && typeof mocha.setup === 'function') {
    mocha.setup('bdd');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
