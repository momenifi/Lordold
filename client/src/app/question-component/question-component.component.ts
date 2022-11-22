import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Question} from '../Question';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {style} from '@angular/animations';

@Component({
  selector: 'app-question-component',
  templateUrl: './question-component.component.html',
  styleUrls: ['./question-component.component.css']
})
export class QuestionComponentComponent implements OnChanges {
  @Input() question: Question;
  wordsWithsStyles: any = [];
  
  bothIntensitiesBoolean = ['rgb(217,83,79)', 'rgb(0,0,0)', 'rgb(217,83,79)']

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnChanges() {
    this.wordsWithsStyles = [];
    /*if (this.question)
    {
      this.question.q_text_token.forEach(word => {
        const styleeee = this.sanitizer.bypassSecurityTrustStyle(this.bothIntensitiesBoolean[1 + Number(String(word[1].toFixed(3))[0])]);
        const wordWithStyle = [word, styleeee];
        this.wordsWithsStyles.push(wordWithStyle);
      });
    }*/

  }
}

