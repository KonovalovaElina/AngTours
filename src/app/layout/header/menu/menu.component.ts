import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatMenuModule, MatMenuTrigger, MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MatMenuModule],
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

