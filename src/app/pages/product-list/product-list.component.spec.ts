import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Mock data
  const mockProducts = [
    {
      id: 'test1',
      name: 'Test Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2025-08-21',
      date_revision: '2026-08-21'
    },
    {
      id: 'test2',
      name: 'Another Product',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: '2025-08-22',
      date_revision: '2026-08-22'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    
    spy.getProducts.and.returnValue(of(mockProducts));
    spy.deleteProduct.and.returnValue(of(void 0));

    // Configurar el mock del servicio HttpClient
    TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: spy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: spy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Product List', () => {
    it('should load products on init', () => {
      expect(productServiceSpy.getProducts).toHaveBeenCalled();
      expect(component.allProducts.length).toBe(2);
      expect(component.filteredProducts.length).toBe(2);
    });

    it('should filter products by name', () => {
      component.searchText = 'Another';
      component.applyFilters();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Another Product');
    });

    it('should filter products by description', () => {
      component.searchText = 'Description 1';
      component.applyFilters();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].id).toBe('test1');
    });

    it('should limit displayed products based on itemsToShow', () => {
      component.itemsToShow = 1;
      component.applyFilters();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.totalFilteredResults).toBe(2); // Total should remain 2
    });
  });

  describe('Menu Actions', () => {
    it('should toggle menu visibility', () => {
      component.toggleMenu('test1');
      expect(component.activeMenu).toBe('test1');
      
      component.toggleMenu('test1');
      expect(component.activeMenu).toBeNull();
    });

    it('should navigate to edit form', () => {
      component.editProduct(mockProducts[0]);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/form', 'test1']);
    });

    it('should close menu when clicking outside', () => {
      component.activeMenu = 'test1';
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: document.createElement('div') });
      component.onClickOutside(event);
      expect(component.activeMenu).toBeNull();
    });
  });

  describe('Delete Product', () => {
    it('should show delete confirmation modal', () => {
      component.promptDelete(mockProducts[0]);
      expect(component.showModal).toBeTrue();
      expect(component.productToDelete).toBe(mockProducts[0]);
    });

    it('should cancel delete operation', () => {
      component.promptDelete(mockProducts[0]);
      component.cancelDelete();
      expect(component.showModal).toBeFalse();
      expect(component.productToDelete).toBeNull();
    });

    it('should delete product and update list', () => {
      component.promptDelete(mockProducts[0]);
      component.confirmDelete();
      
      expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('test1');
      expect(component.showModal).toBeFalse();
      expect(component.productToDelete).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search results', () => {
      component.searchText = 'nonexistent';
      component.applyFilters();
      expect(component.filteredProducts.length).toBe(0);
      expect(component.totalFilteredResults).toBe(0);
    });

    it('should handle case-insensitive search', () => {
      component.searchText = 'ANOTHER';
      component.applyFilters();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Another Product');
    });
  });
});