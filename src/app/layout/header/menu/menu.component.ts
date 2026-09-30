import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnChanges {
  @Input() items: Array<{ route: string; title: string }> = [];
  @Input() label: string;

  isOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Если изменился список пунктов — закрываем меню, чтобы не показывать старое содержимое
    if (changes['items']) {
      this.isOpen = false;
    }
  }
}

