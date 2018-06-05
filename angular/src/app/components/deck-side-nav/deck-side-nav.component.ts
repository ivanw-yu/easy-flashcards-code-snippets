import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../flashcard/flashcard.component'
@Component({
  selector: 'app-deck-side-nav',
  templateUrl: './deck-side-nav.component.html',
  styleUrls: ['./deck-side-nav.component.css']
})
export class DeckSideNavComponent implements OnInit {
  @Input() flashcards : Card[];
  @Input() editMode : boolean;
  @Output() displayNewCard: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteRequest : EventEmitter<number> = new EventEmitter<number>();
  @Output() editRequest : EventEmitter<number> = new EventEmitter<number>();
  //event sent to allow arrow commands to work again, after the search bar has been focused out.
  @Output() enableCommandsRequest : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedIndex : number;
  showAnswers : boolean;
  // @Input() setBottom : boolean; // set to true when the browser side is small enough.
  searchMessage : string;
  matchedIndices : number[];

  constructor() {
    // showAnswers by default only when it's on edit mode.
    this.showAnswers = this.editMode == undefined || this.editMode == false ? false : true; 
    this.onDisplayCard(0);
    // this.setBottom = false;
    // console.log(wind)
    //console.log("outwer width",window.outerWidth);
    //console.log("inner width: ", window.innerWidth);
    // window.onresize = () => {
    //   console.log(window.outerWidth);
    //   if(window.outerWidth <= 600){
    //     this.setBottom = true;
    //   }else{
    //     this.setBottom = false;
    //   }
    // }
  }

  ngOnInit() {
    //document.getElementById("0").click();
  }

  onDisplayCard(index : number){
    this.selectedIndex = index;
    this.displayNewCard.emit(this.selectedIndex);
  }

  isSelected(index){
    return index == this.selectedIndex;
  }
  clickAnswerSwitch(){
    this.showAnswers = !this.showAnswers ? true : false;
  }

  delete(index){
    this.deleteRequest.emit(index);
  }

  edit(index){
    this.editRequest.emit(index);
  }

  searchDeck(keywords : string){
    //document.getElementById("deckSearchMessage").innerHTML = keywords;
    this.matchedIndices = [];
    // let keywordsArray = keywords.split(/[ ]+/);
    let keywordsRegExp = new RegExp(keywords.split(/[ ]+/).join('|'), "ig");
    for(let i = 0; i < this.flashcards.length; i++){
      if(keywordsRegExp.test(this.flashcards[i].answer) || keywordsRegExp.test(this.flashcards[i].question)){
        this.matchedIndices.splice(0,0,i);
      }
      // for(let j = 0; j<keywordsArray.length; j++){
      //   let nextRegExp = new RegExp(keywordsArray[j]);
      //   if(nextRegExp.test(this.flashcards[i].answer) || nextRegExp.test(this.flashcards[i].question)){

      //   }
      // }
    };

    // for(let i = 0; i < matchedIndices.length; i++){
    //   let card = this.flashcards[matchedIndices[i]];
    //   this.flashcards.splice(matchedIndices[i], 1);
    //   this.flashcards.splice(0,0, card);
    // }

    this.selectedIndex = this.matchedIndices && this.matchedIndices.length ? this.matchedIndices[0] : this.selectedIndex;
    this.searchMessage = this.matchedIndices.length ?
                                this.matchedIndices.length > 1 ?
                                  this.matchedIndices.length.toString() + " matches found." : "1 match found" 
                                : "No match found";
    this.displayNewCard.emit(this.selectedIndex);   
  }

  nextSearchResult(){
    if(this.matchedIndices.indexOf(this.selectedIndex) == -1){
      this.selectedIndex = this.matchedIndices[0];
    }
    this.selectedIndex = this.matchedIndices[(this.matchedIndices.indexOf(this.selectedIndex) + 1) % this.matchedIndices.length]
    this.displayNewCard.emit(this.selectedIndex);
  }

  prevSearchResult(){
    if(this.matchedIndices.indexOf(this.selectedIndex) == -1){
      this.selectedIndex = this.matchedIndices[0];
    }
    let index = this.matchedIndices.indexOf(this.selectedIndex) - 1;
    this.selectedIndex = index < 0 ? 
                                    this.matchedIndices[this.matchedIndices.length - 1]
                                    : this.matchedIndices[index];
    this.displayNewCard.emit(this.selectedIndex);
  }

  disconnectCommands(){
    $(document).unbind('keydown');
  }

  reconnectCommands(){
    this.enableCommandsRequest.emit(true);
  }
}
