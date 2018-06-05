import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import {AuthenticationService} from '../../services/authentication.service';
import { ActivatedRoute } from "@angular/router";
import {TimeHelper} from '../dashboard/dashboard.component';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  decks : Deck[];
  flashcards : string[];
  keywords : string[];
  phrases : Object[];
  noMatch : boolean;
  timeHelper : TimeHelper = new TimeHelper();
  numToShow : number;
  sortVal : string;
  openLogin : boolean;
  watchList : string[];
  addOrRemoveMessage : string;

  constructor(private reqService : RequestService,
              private route : ActivatedRoute,
              private authService : AuthenticationService) {
                this.reqService.getWatchList().subscribe(res => {
                  if(res.success){
                    this.watchList = res.watchlist;
                  } else {
                    this.watchList = [];
                  }
                });
    let deck = this.route.params.subscribe(params => {
                                              let decodedParam = decodeURIComponent(params.keywords);
                                              //console.log("decoded: ", decodedParam);
                                              this.reqService.getDeckByKeywords(decodedParam).subscribe(res => {
                                              if(res.success){
                                                this.noMatch = res.noMatch;
                                                this.decks = [];//res.decks;
                                                this.openLogin = false;
                                                // for(let i = 0; i < res.decks.length; i++){
                                                //   this.flashcards = res.decks[0].flashcards;
                                                // }
                                                
                                                // returns all flashcards of each deck, as a STRING
                                                this.flashcards = res.decks.map((element) => {
                                                  return JSON.stringify(element.flashcards); //transform to string in order to get the answer/questions
                                                });

                                                res.decks.forEach((deck) => {
                                                  // var nextDeck = new Deck(deck.created, deck.views, deck.user, this.flashcards, (deck.lastModified != undefined) ? deck.lastModified : null);
                                                  this.decks.push( new Deck(deck.title, deck.created, deck.views, deck.username, deck.subject != undefined ? deck.subject : null, deck.flashcards,deck._id, (deck.lastModified != undefined) ? deck.lastModified : null));
                                                })

                                                this.numToShow = this.decks.length > 6 ? 6 : this.decks.length;

                                                this.keywords = (res.keywords != undefined) ? res.keywords.split(/[ ]+/) : [];
                                                this.sortVal = "date-desc";
                                                let fieldAndOrder = this.sortVal.split("-");
                                                this.sort();
                                              }else{
                                                console.log("fail, res: ", res, "params: ", params )
                                              }
                                         });
    });
   }

  ngOnInit() {
  }

  getKeywords(index : number){
    if(this.keywords == undefined){
      return false;
    }
    let keywordsFound = [];
    for(let i = 0; i < this.keywords.length; i++){
       let nextRegEx = this.keywords[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
       if((new RegExp(nextRegEx, "i")).test(this.flashcards[index])){
        keywordsFound.push(this.keywords[i]);
       }
      keywordsFound.sort(function(a, b){
        return a.length - b.length;
      });
    }
    return keywordsFound;
  }



  getCardClass(index){
    let isVisible= this.toShow(index);
    let cardClass = {"deck-summary": isVisible, 
                     "col-xs-4" : isVisible};
    switch(index%3){
      case 0:
        cardClass["left-card"] = true;
        return cardClass;
      case 1:
        cardClass["middle-card"] = true;
        return cardClass;
      case 2:
        cardClass["right-card"] = true;
        return cardClass;
    } 
  }

  addToWatchList(deckId, title: string){
    this.reqService.addToWatchList(deckId).subscribe( res => {
      if(res.success){
       this.watchList.push(deckId);
       this.addOrRemoveMessage = title + " has been added to your watchlist!"; 
       var div  = document.getElementById("add-remove-message");
       div.style.display = "block";
       setTimeout(()=>{div.style.display = "none"},
                   5000);
      }else{
        console.log("fail adding to watchlist");
      }
    });
  }

  showMore(){
    this.numToShow += 6;
  }

  toShow(index){
    return index <= this.numToShow;
  }

  orders = {"asc" : 1, "desc" : -1};
  // negative is descending, positive is ascending
  sort(){
    const sortType = this.sortVal.split("-");
    let field = sortType[0];
    let order = this.orders[sortType[1]];
    switch(field){
      case "date":
        let offset = (new Date().getTimezoneOffset() / 60);
        this.decks.sort( (a,b) => {
          return (new Date( Math.max(new Date(a.created - offset).getTime(), a.lastModified ? new Date(a.created - offset).getTime() : 0)/*a.lastModified && a.lastModified > a.created ? a.lastModified : a.created*/).getTime()
                - new Date( Math.max(new Date(b.created - offset).getTime(), b.lastModified ? new Date(b.created - offset).getTime() : 0)/*b.lastModified && b.lastModified > b.created ? b.lastModified : b.created*/).getTime()) * order
        });
        break;
      case "view":
        this.decks.sort( (a,b) => {
          return (a.views - b.views) * order;
        });
        break;
      case "title":
        this.decks.sort( (a,b) => {
          return -order * ((a.title.toUpperCase() != b.title.toUpperCase()) ? 
                                ((a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : -1)
                                : 0);
        });
        break;
    }
  }

  
  containsInWatchList(id : string){
    return this.watchList != undefined && this.watchList.indexOf(id) != -1;
  }

  removeFromWatchList(id : string, title: string){
    this.reqService.removeFromWatchList(id).subscribe(res => {
      if(res.success){
        this.reqService.getWatchList().subscribe(data => {
          this.watchList = data.watchlist;
          this.addOrRemoveMessage = title + " has been removed from your watchlist."; 
          var div  = document.getElementById("add-remove-message");
          div.style.display = "block";
          setTimeout(()=>{div.style.display = "none"},
                      5000);
        });
      }
    })
  }
}

export class Deck {
  created : number;
  views: number;
  username: string;
  subject: string;
  flashcards : Object;
  title: string;
  _id: string;
  lastModified: number;

  constructor(title, created, views, username, subject, flashcards,_id, lastModified?){
    this._id = _id;
    this.title = title;
    this.created = created;
    this.views = views;
    this.username = username;
    this.subject = subject;
    this.flashcards = flashcards;
    this.lastModified = lastModified;
  }
}
