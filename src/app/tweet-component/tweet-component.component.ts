import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Tweet} from '../Tweet';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {style} from '@angular/animations';

@Component({
  selector: 'app-tweet-component',
  templateUrl: './tweet-component.component.html',
  styleUrls: ['./tweet-component.component.css']
})
export class TweetComponentComponent implements OnChanges {
  @Input() tweet: Tweet;
  wordsWithsStyles: any = [];
  bothIntensities = ['rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(166,217,106)', 'rgb(102,189,99)', 'rgb(26,152,80)'];
  //bothIntensities = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)']
  nonoffensiveIntensities = ['rgb(247,252,253)', 'rgb(229,245,249)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(65,174,118)', 'rgb(35,139,69)', 'rgb(0,109,44)', 'rgb(0,68,27)'];
  offensiveIntensities = ['rgb(255,247,236)', 'rgb(254,232,200)', 'rgb(253,212,158)', 'rgb(253,187,132)', 'rgb(252,141,89)', 'rgb(239,101,72)', 'rgb(215,48,31)', 'rgb(179,0,0)', 'rgb(127,0,0)'];
  hexShadows = ['1px 1px 4px #c51b7d', '1px 1px 4px #de77ae', '1px 1px 4px #f1b6da', '1px 1px 4px #fde0ef', '1px 1px 4px #f7f7f7', '1px 1px 4px #e6f5d0', '1px 1px 4px #b8e186', '1px 1px 4px #7fbc41', '1px 1px 4px #4d9221'];
  hexBorders = ['thick solid #c51b7d', 'thick solid #de77ae', 'thick solid #f1b6da', 'thick solid #fde0ef', 'thick solid #f7f7f7', 'thick solid #e6f5d0', 'thick solid #b8e186', 'thick solid #7fbc41', 'thick solid #4d9221'];
  wordSize = ['150%', '132%', '120%', '110%', '100%', '110%', '120%', '132%', '150%'];
  bothIntensitiesBoolean = ['rgb(222,45,38)', 'rgb(0,0,0)', 'rgb(49,163,84)']

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnChanges() {
    this.wordsWithsStyles = [];
    this.tweet.words.forEach(word => {
      const styleeee = this.tweet.predictedAsOffensive ? this.sanitizer.bypassSecurityTrustStyle(this.bothIntensitiesBoolean[1 - Number(String(word[1].toFixed(3))[0])]) :
        this.sanitizer.bypassSecurityTrustStyle(this.bothIntensitiesBoolean[1 + Number(String(word[1].toFixed(3))[0])]);
      const wordWithStyle = [word, styleeee];
      this.wordsWithsStyles.push(wordWithStyle);
    });

  }
}

