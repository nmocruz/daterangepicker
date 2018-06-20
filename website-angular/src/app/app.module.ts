import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
//import { NgxMdModule } from 'ngx-md';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DocsComponent } from './components/docs/docs.component';
import { TestsComponent } from './components/tests/tests.component';
import { ExamplesComponent } from './components/examples/examples.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    //NgxMdModule.forRoot(),
    MarkdownModule.forRoot({
      loader: HttpClient,
    }),
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
export class AppModule { }
