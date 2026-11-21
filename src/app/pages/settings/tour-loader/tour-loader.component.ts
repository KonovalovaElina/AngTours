import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToursService } from '../../../services/tours.service';
import { MatButtonModule } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tour-loader',
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, NgTemplateOutlet, MatSnackBarModule],
  templateUrl: './tour-loader.component.html',
  styleUrl: './tour-loader.component.scss',
})
export class TourLoaderComponent implements OnInit {
  tourForm!: FormGroup;
  imgPreview: string | null = null;
  selectedFile: File | null = null;
  tourFormFieldsArr = [
    { label: 'Наименование', placeholder: 'Введите наименование тура', control: 'name', type: 'text' },
    { label: 'Описание', placeholder: 'Введите описание', control: 'description', type: 'text' },
    { label: 'Оператор', placeholder: 'Наименование оператора', control: 'tourOperator', type: 'text' },
    { label: 'Цена', placeholder: 'Укажите цену', control: 'price', type: 'number' },
    { label: 'Изображение', control: 'img', type: 'file' },
  ];

  constructor(
    private toursService: ToursService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tourForm = new FormGroup({
      name: new FormControl('', {validators: Validators.required}),
      description: new FormControl('', [Validators.required, Validators.minLength(6)]),
      tourOperator: new FormControl(),
      price: new FormControl(),
      img: new FormControl(),
    });
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => (this.imgPreview = reader.result as string);
    reader.readAsDataURL(this.selectedFile);
  }

  createTour(): void {
    if (this.tourForm.invalid) return;

    const { name, description, tourOperator, price } = this.tourForm.getRawValue();

    const formData = new FormData();
    formData.append('name', name ?? '');
    formData.append('description', description ?? '');
    formData.append('tourOperator', tourOperator ?? '');
    formData.append('price', String(price ?? ''));

    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    this.toursService.createTour(formData).subscribe({
      next: () => {
        this._snackBar.open('Тур успешно создан!', 'Закрыть', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this._snackBar.open('Ошибка при создании тура. Попробуйте ещё раз.', 'Закрыть', {
          duration: null, // не закрываем сама — пусть пользователь увидит и закроет
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    })
  }
}
