import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
  user: any;
  jwtToken: any;
  
  // configured for development and production environment
  domainAndPort : string = !/localhost/.test(document.location.host) ? "" : "http://localhost:3000/";

  constructor(private http: Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domainAndPort + "user/register", user, {headers : headers}).map(res => res.json());
  }

  loginUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domainAndPort + "user/login", user, {headers : headers}).map(res => res.json());
  }

  storeLocalStorage(token, user){
    this.jwtToken = token;
    this.user = user;
    localStorage.setItem("id_token", this.jwtToken);
    localStorage.setItem("user", JSON.stringify(this.user));
  }

  logout(){
    localStorage.clear();
    this.jwtToken = null;
    this.user = null;
  }

  getToken(){
    return localStorage.getItem("id_token");
  }
  getUser(){
    return JSON.parse(localStorage.getItem("user"));
  }

  loggedIn(){
    return JSON.parse(localStorage.getItem("user")) ? true : false;
  }

  passwordCompare(password){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());
    headers.append("Access-Control-Allow-Credentials", "true");
    return this.http.post(this.domainAndPort + "validatePassword", {id: JSON.parse(this.getUser())._id, password : password}, {headers: headers}).map(res => res.json());
  }
}
