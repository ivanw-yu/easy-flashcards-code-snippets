import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service'
import {ValidationService} from '../../services/validation.service'
import {Router, NavigationExtras} from '@angular/router'
import {FlashMessagesService} from 'angular2-flash-messages'
import {RequestService} from '../../services/request.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  keywords : string;
  filter : string;
  openLogin : boolean;
  openRegistration : boolean;
  dropdownOpen : boolean;

  constructor(private authService : AuthenticationService,
              private validationService : ValidationService,
              private flashMessages : FlashMessagesService,
              private router: Router,
              private reqService : RequestService) {
                this.keywords = '';
                this.openLogin = this.openRegistration = false;
                this.dropdownOpen = false;
               }

  ngOnInit() {
    $( "#searchBar" ).on('focus', function() {
      $(document).unbind('keydown');
    });

  }

  ngOnChanges(){
    
  }

  loggedIn(){
    return localStorage.getItem('id_token')!= null;
  }

  onLogout(){
    this.authService.logout();
    this.flashMessages.show("You have logged out", {cssClass : "alert-success", timeout : 3000})
    this.router.navigate(['/']);
    return false;
  }

  // user won't be able to add any extra "/" or * in the URI.
  searchCards(){
    this.router.navigate(['/search/' + encodeURIComponent(this.keywords)]);
  }

  // when opening registration, close login first
  openRegistrationForm(){
    this.openRegistration = !(this.openLogin = false);
  }

  // when opening login, close registration first
  openLoginForm(){
    this.openLogin = !(this.openRegistration = false);
  }

  dropdownSwitch(){
    this.dropdownOpen = !this.dropdownOpen;
  }
}
