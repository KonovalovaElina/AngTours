import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FiltersService, FiltersState } from '../../services/filters.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-aside',
  imports: [CommonModule, MatDatepickerModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AsideComponent implements OnInit {
  private filtersService = inject(FiltersService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('dateInput') dateInputEl!: ElementRef<HTMLInputElement>;

  selectedType: string | null = null;
  selectedDate: Date | null = null;

  currentFilters: FiltersState | null = null;

  tourTypes = [
    { key: null, label: 'Все типы' },
    { key: 'single', label: 'Одиночный' },
    { key: 'multi', label: 'Групповой' }
  ];

  ngOnInit(): void {
    this.filtersService.state$.subscribe((state) => {
      this.currentFilters = state;
      this.selectedType = state.tourType ?? null;
      this.selectedDate = state.tourDate ?? null;
    });
  }

  onTypeChange(type: string | null): void {
    this.selectedType = type;
    this.filtersService.update({ tourType: type });
  }

  onDateChange(event: { value: Date | null }): void {
    const date = event.value; 
    this.selectedDate = date;
    this.filtersService.update({ tourDate: date });
  }

  onResetFilters(): void {
    this.filtersService.reset();
    this.selectedType = null;
    this.selectedDate = null;

    // Принудительно сбрасываем значение в DOM-инпуте
    if (this.dateInputEl) {
      this.dateInputEl.nativeElement.value = '';
    }

    this.cdr.detectChanges();
  }
}