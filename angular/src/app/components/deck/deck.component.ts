import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FlashcardComponent} from '../flashcard/flashcard.component'
import {ActivatedRoute} from '@angular/router'
import {RequestService} from '../../services/request.service'
import {Card} from '../flashcard/flashcard.component'
import {DeckSideNavComponent} from '../deck-side-nav/deck-side-nav.component'; 
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css', '../deckcreation/deckcreation.component.css']
})
export class DeckComponent implements OnInit {
  username : string;
  title: string;
  subject: string;
  flashcards : Card[];
  _id : string;
  displayAnswer : boolean;
  selectedCard : number;
  viewType: string;
  face: string;
  centerFlashcard: boolean;

  constructor(private route: ActivatedRoute,
              private reqService : RequestService) {
                let deck = this.route.params.subscribe(params => {
                                              
                                              this.reqService.getDeckById(params.id.toString()).subscribe(res => {
                                                this.reqService.updateDeckViews(params.id.toString()).subscribe(result => {
                                                  if(res.success){
                                                    this.viewType = "single";
                                                    this.face = "question";
                                                    this.flashcards = [];
                                                    res.deck.flashcards.forEach(element => {
                                                      this.flashcards.push(new Card(element.question, element.answer));
                                                    });
                                                    this.title = res.deck.title;
                                                    this.subject = res.deck.subject || "";
                                                    this.username = res.deck.username;
                                                    this.displayAnswer = true; // initially display answer of current card.
                                                    this.selectedCard = 0; // initially, the card selected is the first card
                                        
                                                  }else{
                                                    console.log("fail, res: ", res, "params: ", params )
                                                  }
                                                });
                                         });
                });
              };

  ngOnInit() {
    this.centerFlashcard = (window.outerWidth <= 600) ? true : false;
    const keyButtons = [37,38,39,40];
    $(document).on('keydown', (e) => {
      if(keyButtons.indexOf(e.which) == -1){
        return true;
      }else{
        e.preventDefault();
      }
      // left = 37, top = 38, right = 39, bottom = 40
      switch(e.which){
        case 37:
          this.nextLeftCard();
          break;
        case 38:
          this.changeFace();
          break;
        case 39:
          this.nextRightCard();
          break;
        case 40:
          this.changeViewType(this.viewType == "single" ? "double" : "single");
          break;
      }

      });
      $("#searchBar").on('focus', ()=>{
        $(document).unbind('keydown');
      })

      $("#searchBar").on('focusout', ()=>{
        $(document).on('keydown', (e) => {
          if(keyButtons.indexOf(e.which) == -1){
            return true;
          }else{
            e.preventDefault();
          }

          // left = 37, top = 38, right = 39, bottom = 40
          switch(e.which){
            case 37:
              this.nextLeftCard();
              break;
            case 38:
              this.changeFace();
              break;
            case 39:
              this.nextRightCard();
              break;
            case 40:
              this.changeViewType(this.viewType == "single" ? "double" : "single");
              break;
          }
        });
      })

    window.onresize = () => {
      if(window.outerWidth <= 600){
        this.centerFlashcard = true;
      }else{
        this.centerFlashcard = false;
      }
    }
  }

  ngOnDestroy(){
    $(document).unbind('keydown');
  }

  isSelected(index: number){
    return this.selectedCard == index;
  }

  selectNewCard(index: number){
    this.selectedCard = index;
    this.displayAnswer = false;
  }

  nextRightCard(){
    this.selectedCard = this.selectedCard == this.flashcards.length-1 ? 0 : this.selectedCard + 1;
    this.displayAnswer = false;
  }

  nextLeftCard(){
    this.selectedCard = this.selectedCard == 0 ? this.flashcards.length-1 : this.selectedCard - 1;
    this.displayAnswer = false;
  }

  changeViewType(viewType){
    // if a checked checkbox has been clicked again, don't allow that checkbox to be unchecked.
    if(this.viewType = viewType){
      document.getElementsByTagName("input")[viewType + "View"].checked = true;
    } else {
      this.viewType = viewType;
    }
  }

  changeFace(){
    this.face = (this.face == "question") ? 'answer' : 'question';
  }

  reconnectCommands(){
    const keyButtons = [37,38,39,40];
    $(document).on('keydown', (e) => {
      if(keyButtons.indexOf(e.which) == -1){
        return true;
      }else{
        e.preventDefault();
      }

      // left = 37, top = 38, right = 39, bottom = 40
      switch(e.which){
        case 37:
          this.nextLeftCard();
          break;
        case 38:
          this.changeFace();
          break;
        case 39:
          this.nextRightCard();
          break;
        case 40:
          this.changeViewType(this.viewType == "single" ? "double" : "single");
          break;
      }
    });
  }

}
