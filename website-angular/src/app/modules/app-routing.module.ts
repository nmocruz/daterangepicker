import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { DocsComponent } from '../components/docs/docs.component';
import { ExamplesComponent } from '../components/examples/examples.component';
import { TestsComponent } from '../components/tests/tests.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'examples', component: ExamplesComponent },
  { path: 'tests', component: TestsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
