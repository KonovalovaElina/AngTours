import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TourLoaderComponent } from './tour-loader/tour-loader.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [MatTabsModule, TourLoaderComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
