import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatInput} from "@angular/material/input";
import {MatButton, MatFabButton} from "@angular/material/button";

import index from '../assets/index.json';
import lunr from 'lunr'
import Result = lunr.Index.Result;
import {NgForOf, NgIf} from "@angular/common";
import {MatLine} from "@angular/material/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatFormField, FormsModule, MatCard, MatCardContent, MatList, MatListItem, MatInput, MatLabel, MatButton, MatFabButton, NgIf, MatLine, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  idx = lunr.Index.load(index)
  title = 'competitions_ffhb_front';
  searchQuery: any;
  clubs:Result[] = []

  searchClubs() {
    this.clubs = this.idx.search(`*${this.searchQuery}*`)
    console.log(this.clubs)

  }
}
