import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FlashMessagesService} from 'angular2-flash-messages';


/*
editMode = true means cancel and save button appears on a form, | false means p tags with edit button
viewType = 'edit' means the flashcard has forms, not <p>'s
flashcard : Card required input (question and answer are optional)
*/
@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit {
  @Input() flashcard : Card;
  @Input() answer : string;
  @Input() question : string;

  // the only variable used to decide when it should show a form with save button, or <p> with edit button,
  // if viewType == 'edit'
  @Input() editMode : boolean;

  @Output() updateFlashcard : EventEmitter<Card> = new EventEmitter<Card>();
  @Output() cancelRequest : EventEmitter<Card> = new EventEmitter<Card>();
  @Output() viewChangeRequest : EventEmitter<string> = new EventEmitter<string>();
  @Input() viewType : string;
  @Input() displayType : string;
  before : Card; // used to save the current flashcards, in the event the user cancels changes when editing.

  constructor() {
    this.displayType = "question";
  }

  ngOnInit() {
    if(this.editMode == undefined){
      this.editMode = false;
    }
    if(this.viewType != "edit"){
      this.viewType = "single";
    }
    this.before = this.flashcard;
    this.displayType = "question";
    var resizeTimer;
  }

  ngAfterViewChecked(){
    var elem = document.getElementById("flashcard");
    if(elem!=null){
      elem.style.overflow = "scroll";
    }
  }

  ngOnChanges(){
    this.before = this.flashcard;
    if(!this.editMode && this.viewType != "single"){
      this.displayType = "question"; //if flashcard is changed, display the question first
    }
    var resizeTimer;
    var elem = document.getElementById("flashcard");
    if(elem!=null){
      elem.style.overflow = "scroll";
    }
  }
  flipCard(){
    if(this.displayType == "answer"){
      this.displayType = "question";
    }else{
      this.displayType = "answer";
    }
  }

  switchView(){
    if(this.viewType == "single"){
      this.viewType = "double";
      this.displayType = "question";
    }else{
      this.viewType = "single";
    }
    this.viewChangeRequest.emit(this.viewType);
    return false;
  }

  saveFlashcard(question, answer){
    this.updateFlashcard.emit({question: question, answer: answer});
    this.editMode = false;
  }

  edit(){
    this.before = new Card(this.question, this.answer);
    this.editMode = true;
  }

  // emit the previous card in the event that a card is being created, but the user cancels
  // parent components should handle what happens if it's a newly created card that is being canceled.
  cancel(){
    this.flashcard = this.before;
    // console.log(this.before, this.flashcard);
    this.editMode = false;
    this.cancelRequest.emit(this.before);
  }

}

export class Card {
  question: string;
  answer : string;
  constructor(question?: string, answer?:string){
    this.question = question;
    this.answer = answer;
  }
}
