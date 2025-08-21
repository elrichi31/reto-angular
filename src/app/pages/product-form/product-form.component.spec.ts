import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Mock data
  const mockProduct = {
    id: 'test123',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'http://test.com/logo.png',
    date_release: '2025-08-21',
    date_revision: '2026-08-21'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts', 'addProduct', 'updateProduct', 'getProductById']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    
    // Configure spy behavior
    spy.getProducts.and.returnValue(of([mockProduct]));
    spy.getProductById.and.returnValue(of(mockProduct));
    spy.addProduct.and.returnValue(of(mockProduct));
    spy.updateProduct.and.returnValue(of(mockProduct));

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: spy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['id', 'test123']])
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validations', () => {
    it('should validate ID format (3-10 characters)', () => {
      component.product.id = 'ab';
      component.validateField('id');
      expect(component.errors.id).toBeTruthy();

      component.product.id = 'abc123';
      component.validateField('id');
      expect(component.errors.id).toBeFalsy();

      component.product.id = 'toolongidvalue';
      component.validateField('id');
      expect(component.errors.id).toBeTruthy();
    });

    it('should validate name length (5-100 characters)', () => {
      component.product.name = 'abc';
      component.validateField('name');
      expect(component.errors.name).toBeTruthy();

      component.product.name = 'Valid Product Name';
      component.validateField('name');
      expect(component.errors.name).toBeFalsy();
    });

    it('should validate description length (10-200 characters)', () => {
      component.product.description = 'short';
      component.validateField('description');
      expect(component.errors.description).toBeTruthy();

      component.product.description = 'This is a valid product description';
      component.validateField('description');
      expect(component.errors.description).toBeFalsy();
    });

    it('should validate logo URL is required and valid', () => {
      // Prueba campo vacío
      component.product.logo = '';
      component.validateField('logo');
      expect(component.errors.logo).toBe('Logo requerido');

      // Prueba URL inválida
      component.product.logo = 'not-a-url';
      component.validateField('logo');
      expect(component.errors.logo).toBe('URL no válida');

      // Prueba URL válida
      component.product.logo = 'http://example.com/logo.png';
      component.validateField('logo');
      expect(component.errors.logo).toBeFalsy();

      // Prueba URL HTTPS
      component.product.logo = 'https://example.com/logo.png';
      component.validateField('logo');
      expect(component.errors.logo).toBeFalsy();
    });

    it('should validate release date is not in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      component.product.date_release = pastDate.toISOString().split('T')[0];
      component.validateField('date_release');
      expect(component.errors.date_release).toBeTruthy();

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      component.product.date_release = futureDate.toISOString().split('T')[0];
      component.validateField('date_release');
      expect(component.errors.date_release).toBeFalsy();
    });
  });

  describe('Form Operations', () => {
    it('should load product data when editing', () => {
      productServiceSpy.getProductById('test123').subscribe(data => {
        expect(data.name).toBe(mockProduct.name);
      });
    });

    it('should reset form to initial state', () => {
      component.product = { ...mockProduct };
      component.resetForm();
      expect(component.product.id).toBe('');
      expect(component.product.name).toBe('');
      expect(component.errors).toEqual({});
    });

    it('should create new product when form is valid', () => {
      component.product = { ...mockProduct };
      component.idOriginal = null;
      component.submit();
      expect(productServiceSpy.addProduct).toHaveBeenCalledWith(mockProduct);
    });

    it('should update existing product when form is valid', () => {
      component.product = { ...mockProduct };
      component.idOriginal = 'test123';
      component.submit();
      expect(productServiceSpy.updateProduct).toHaveBeenCalledWith('test123', mockProduct);
    });

    it('should navigate back when goBack is called', () => {
      component.goBack();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Date Handling', () => {
    it('should automatically set revision date to one year after release date', () => {
      const releaseDate = '2025-08-21';
      component.product.date_release = releaseDate;
      component.onDateReleaseChange(releaseDate);
      expect(component.product.date_revision).toBe('2026-08-21');
    });
  });
});
