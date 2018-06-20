var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxMdModule } from 'ngx-md';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DocsComponent } from './components/docs/docs.component';
import { TestsComponent } from './components/tests/tests.component';
import { ExamplesComponent } from './components/examples/examples.component';
import { HomeComponent } from './components/home/home.component';
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        imports: [
            BrowserModule,
            NgxMdModule.forRoot(),
            AppRoutingModule
        ],
        declarations: [
            AppComponent,
            FooterComponent,
            HeaderComponent,
            DocsComponent,
            TestsComponent,
            ExamplesComponent,
            HomeComponent
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map