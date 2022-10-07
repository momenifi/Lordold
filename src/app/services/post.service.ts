

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class PostService {
  //private url = 'http://jsonplaceholder.typicode.com/posts';
  private url = 'https://lod.gesis.org/rest/v1/search?query=*';

   
  constructor(private httpClient: HttpClient) { }
    getPosts(query: string){
      return this.httpClient.get(this.url+query+'*&lang=de');
  }
  
} 