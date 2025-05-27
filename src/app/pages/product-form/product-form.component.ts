import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  product = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: ''
  };
  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) { }

  errors: any = {};

  validate() {
    this.errors = {};

    if (!this.product.id || this.product.id.length < 3 || this.product.id.length > 10) {
      this.errors.id = 'ID requerido (3-10 caracteres)';
    }

    if (!this.product.name || this.product.name.length < 5 || this.product.name.length > 100) {
      this.errors.name = 'Nombre requerido (5-100 caracteres)';
    }

    if (!this.product.description || this.product.description.length < 10 || this.product.description.length > 200) {
      this.errors.description = 'Descripción requerida (10-200 caracteres)';
    }

    if (!this.product.logo) {
      this.errors.logo = 'Logo requerido';
    }

    const today = new Date().toISOString().split('T')[0];
    if (!this.product.date_release || this.product.date_release < today) {
      this.errors.date_release = 'Fecha debe ser hoy o futura';
    }

    const expectedRevision = new Date(this.product.date_release);
    expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);
    const expected = expectedRevision.toISOString().split('T')[0];

    if (this.product.date_revision !== expected) {
      this.errors.date_revision = `Debe ser ${expected}`;
    }

    return Object.keys(this.errors).length === 0;
  }

  submit() {
    if (this.validate()) {
      if (this.idOriginal) {
        // Modo edición
        this.productService.updateProduct(this.idOriginal, this.product).subscribe({
          next: () => {
            alert('Producto actualizado correctamente');
            this.router.navigate(['/']);
          },
          error: (err) => console.error('Error al actualizar', err)
        });
      } else {
        // Modo creación
        this.productService.addProduct(this.product).subscribe({
          next: () => {
            alert('Producto agregado correctamente');
            this.router.navigate(['/']);
          },
          error: (err) => console.error('Error al agregar', err)
        });
      }
    }
  }

  resetForm() {
    this.product = {
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    };
    this.errors = {};
  }
  idOriginal: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idOriginal = id;
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          console.error('Error al cargar producto', err);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/'])
  }

  today = new Date().toISOString().split('T')[0]; // hoy en formato yyyy-mm-dd

  onDateReleaseChange(date: string) {
    if (date) {
      const releaseDate = new Date(date);
      releaseDate.setFullYear(releaseDate.getFullYear() + 1);
      this.product.date_revision = releaseDate.toISOString().split('T')[0];
    }
  }

}