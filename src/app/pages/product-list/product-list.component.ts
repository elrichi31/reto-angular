import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  showModal = false
  productToDelete: Product | null = null
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchText = '';
  itemsToShow = 5;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters();
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }

  applyFilters(): void {
    const filtered = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.filteredProducts = filtered.slice(0, this.itemsToShow);
  }

  activeMenu: string | null = null;

  toggleMenu(id: string) {
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  editProduct(product: Product) {
    // Aquí puedes hacer navegación o abrir modal
    this.router.navigate(['/form', product.id])
    console.log('Editar:', product);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Cierra si el click no fue dentro de un icono o dropdown
    if (!target.closest('.dropdown')) {
      this.activeMenu = null;
    }
  }

  promptDelete(product: Product) {
    this.productToDelete = product;
    this.showModal = true;
  }
  
  cancelDelete() {
    this.showModal = false;
    this.productToDelete = null;
  }
  
  confirmDelete() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.allProducts = this.allProducts.filter(p => p.id !== this.productToDelete?.id);
          this.applyFilters();
          this.cancelDelete()
        },
        error: (err: any) => console.error('Error al eliminar producto:', err)
      });;
    }
  }

}