import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOrder } from '../../models/order';
import { OrderListService } from '../../services/order-list.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [MatTableModule, MatPaginatorModule, MatSnackBarModule, CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['_id', 'userId', 'tourId'];
  dataSource = new MatTableDataSource<IOrder>([]);
  total = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = true;

  constructor(
    private orderListService: OrderListService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    const limit = this.paginator ? this.paginator.pageSize : 20;

    this.orderListService.getOrders(page, limit).subscribe({
      next: (res) => {
        this.dataSource.data = res.orders;
        this.total = res.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Не удалось загрузить заказы', 'Закрыть', {
          duration: 3000,
        });
      },
    });
  }

  onPageChange(): void {
    this.loadOrders();
  }
}
