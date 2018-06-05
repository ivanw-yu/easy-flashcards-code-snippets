import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  openLogin: boolean;
  openRegistration: boolean;
  vid;

  constructor(private authService : AuthenticationService) { 
    document.body.style.backgroundColor = "#f2f2f2";
    this.openLogin = false;
    this.openRegistration = false;
  }

  ngOnInit() {

     this.vid = document.getElementsByTagName("video");
     for(let i = 0; i<this.vid.length; i++){
       this.vid[i].oncanplay = () => {
         this.vid[i].addEventListener( "mouseenter", () => {
           this.vid[i].play();
           this.vid[i].style.opacity = ".5";
         });
         
         this.vid[i].addEventListener( "mouseleave", () => {
          this.vid[i].pause();
          this.vid[i].style.opacity = "1";
        });
       }
     }
  }

  ngOnDestroy(){
     document.body.style.backgroundColor = "white";
     for(let i = 0; i<this.vid.length; i++){
        this.vid[i].removeEventListener("mouseenter");
        this.vid[i].removeEventListener("mouseleave");
     }
  }
}
