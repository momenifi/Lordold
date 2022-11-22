import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: 'keywords', pathMatch: 'full' },
  { path: 'keywords', component: AppComponent },
  { path: 'keywords/:id', component: AppComponent },
  { path: 'add', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }