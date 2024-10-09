import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {CharacterSheetComponent} from './character-sheet/character-sheet.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CharacterSheetComponent,
    // CharacterSheetComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
