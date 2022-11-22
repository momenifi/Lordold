export class Tweet {
  id: number;
  words: Array<[string, number]>;
  predictedAsOffensive: boolean;
  neutral: boolean;
  constructor(id: number, words: Array<[string, number]>, predictedAsOffensive: boolean, neutral: boolean){
    this.id = id;
    this.words = words;
    this.predictedAsOffensive = predictedAsOffensive;
    this.neutral = neutral;
  }
}