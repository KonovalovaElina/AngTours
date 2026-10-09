import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsideComponent } from './aside/aside.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    AsideComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    AsyncPipe
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private loaderService = inject(LoaderService);
  loaderStatus$ = this.loaderService.loader$;
}
