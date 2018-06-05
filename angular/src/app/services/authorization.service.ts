import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {tokenNotExpired} from 'angular2-jwt';
import {AuthenticationService} from './authentication.service'

@Injectable()
export class AuthorizationService implements CanActivate{

  constructor(private authenticationService : AuthenticationService, private router : Router) { }

  canActivate(){
    if(this.authenticationService.loggedIn()){
      return true;
    } else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }


}
