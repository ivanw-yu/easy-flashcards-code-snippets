import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router'
import {HttpModule} from '@angular/http'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import {AuthenticationService} from './services/authentication.service'
import {ValidationService} from './services/validation.service'
import {RequestService} from './services/request.service'
import {FontHelperService} from './services/font-helper.service'
import {AuthorizationService} from './services/authorization.service'

import {FlashMessagesModule} from 'angular2-flash-messages';
import { DeckcreationComponent } from './components/deckcreation/deckcreation.component';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { DeckComponent } from './components/deck/deck.component';
import { DeckEditComponent } from './components/deck-edit/deck-edit.component';
import { DeckSideNavComponent } from './components/deck-side-nav/deck-side-nav.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { FooterComponent } from './components/footer/footer.component';

const routes : Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate : [AuthorizationService]},
  {path: 'search', component: SearchComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'deck/create', component: DeckcreationComponent, canActivate : [AuthorizationService]},
  {path: 'deck/:id', component: DeckComponent},
  {path: 'deck/edit/:id', component: DeckEditComponent, canActivate : [AuthorizationService]},
  {path: 'search/:keywords', component: SearchComponent},
  {path: 'search', component: SearchComponent},
  {path: 'unauthorized', component: UnauthorizedComponent}
  ];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProfileComponent,
    SearchComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    DeckcreationComponent,
    FlashcardComponent,
    DeckComponent,
    DeckEditComponent,
    DeckSideNavComponent,
    UnauthorizedComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule
  ],
  providers: [AuthenticationService,
              ValidationService,
              RequestService,
              FontHelperService,
              AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
