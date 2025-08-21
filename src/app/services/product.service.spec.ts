import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts: Product[] = [
      {
        id: 'test1',
        name: 'Test Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: '2025-08-21',
        date_revision: '2026-08-21'
      }
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    const mockProduct: Product = {
      id: 'test1',
      name: 'Test Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2025-08-21',
      date_revision: '2026-08-21'
    };

    service.getProductById('test1').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/test1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should add new product', () => {
    const newProduct: Product = {
      id: 'new1',
      name: 'New Product',
      description: 'New Description',
      logo: 'newlogo.png',
      date_release: '2025-08-21',
      date_revision: '2026-08-21'
    };

    service.addProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update product', () => {
    const updatedProduct: Product = {
      id: 'test1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updatedlogo.png',
      date_release: '2025-08-21',
      date_revision: '2026-08-21'
    };

    service.updateProduct('test1', updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/test1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete product', () => {
    const productId = 'test1';

    service.deleteProduct(productId).subscribe();

    const req = httpMock.expectOne(`http://localhost:3000/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
