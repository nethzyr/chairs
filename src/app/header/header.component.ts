import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadAllCategories, LoadAllChairs } from '../store/actions';
import { AppState } from '../store/reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  activeLang = 'en';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const localLang = localStorage.getItem('lang');
    if (localLang) {
      this.activeLang = localLang;
    }
  }

  private setLang(langKey: string): void {
    if (localStorage.getItem('lang') !== langKey) {
      localStorage.setItem('lang', langKey);
      this.activeLang = langKey;
      this.store.dispatch(new LoadAllCategories());
      this.store.dispatch(new LoadAllChairs());
    }
  }
}
