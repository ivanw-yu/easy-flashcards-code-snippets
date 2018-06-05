import { Injectable } from '@angular/core';
import {Http, Headers, Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthenticationService} from './authentication.service';
import {ValidationService} from './validation.service'

@Injectable()
export class RequestService {
  // configured for development and production enviroment.
  domainAndPort : string = !/localhost/.test(document.location.host) ? "" : "http://localhost:3000/";

  constructor(private http : Http,
              private authService: AuthenticationService,
              private validationService : ValidationService) { }

  editProfile(user){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(this.domainAndPort + "user/profile", user, {headers : headers}).map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    headers.append("Authorization", this.authService.getToken());
    headers.append("Content-Type", "application/json");
    return this.http.get(this.domainAndPort + "user/profile", {headers: headers}).map(res => { return res.json();});
  }

  getDecks(){
    let headers = new Headers();
    headers.append("Authorization", this.authService.getToken());
    headers.append("Content-Type", "application/json");
    return this.http.get(this.domainAndPort + "deck/dashboard", {headers: headers}).map(res => { return res.json()});
  }

  addDeck(data){
    let headers = new Headers();
    headers.append("Authorization", this.authService.getToken());
    headers.append("Content-Type", "application/json");
    return this.http.post(this.domainAndPort + "deck/create", data, {headers : headers}).map(res => res.json());
  }

  getDeckById(id : string){
    let params = new URLSearchParams();
    params.set('search', id); // the user's search value
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.get(this.domainAndPort + "deck/view/"+id, {headers: headers}).map(res => res.json());
  }

  getDeckByKeywords(keywords : string){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.get(this.domainAndPort + "deck/search/"+ encodeURIComponent(keywords), {headers: headers}).map(res => res.json());
  }

  saveNewPassword(username, currentPassword, newPassword){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());
    return this.http.post(this.domainAndPort + "user/profile", {username: username, password : newPassword, currentPassword: currentPassword }, {headers: headers}).map(res => res.json());
  }

  saveNewName(first_name, last_name, username){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());
    return this.http.post(this.domainAndPort + 'user/profile', {first_name: first_name, last_name: last_name, username: username}, {headers: headers}).map(res => res.json());
  }

  editDeck(deck, id){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domainAndPort + "deck/edit/" +  id, deck, {headers: headers}).map(res => res.json());
  }

  updateDeckViews(id){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type', 'application/json');
    let user = this.authService.getUser();
    let username = user ? user.username : undefined;
    return this.http.post(this.domainAndPort + "deck/view/" + id, {username: username}, {headers: headers}).map(res => res.json());
  }

  getPasswordToCompare(username, password){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domainAndPort + "user/validatePassword/", {username: username/*JSON.parse(this.authService.getUser()).username*/, password : password}, {headers: headers}).map(res => res.json());
  }

  deleteDeck(id){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.authService.getToken());
    return this.http.delete(this.domainAndPort + "deck/delete/" + id, {headers: headers}).map(res => res.json());
  }

  // posts to user/watchlist, where req.body will contain the username and deckId
  addToWatchList(deckId){
    let headers = new Headers();
    let data = {
      username : this.authService.getUser().username,
      deckId : deckId
    }
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.authService.getToken());
    return this.http.post(this.domainAndPort + "user/watchlist", data, {headers: headers}).map(res => res.json());
  }

  getWatchList(){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.authService.getToken());
    return this.http.get(this.domainAndPort + "user/watchlist", {headers: headers}).map(res => res.json());
  }

  removeFromWatchList(deckId){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.authService.getToken());
    return this.http.delete(this.domainAndPort + 'user/watchlist/' + deckId, {headers : headers}).map(res => res.json());
  }
}
