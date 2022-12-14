import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {retry, catchError, map} from 'rxjs/operators';
import {throwError, zip} from 'rxjs';


import {CreateProductDTO, Product, UpdateProductDTO} from "../models/product.model";
import {checkTime} from './../interceptors/time.interceptor';
import {environment} from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl: string = `${environment.API_URL}/api/`;

  constructor(private httpClient: HttpClient) {
  }

  getByCategory (categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.httpClient.get<Product[]>
      (`${this.apiUrl}/categories/${categoryId}/products`, { params});
  }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`, {params, context: checkTime()})
      .pipe(
        retry(3),
        map(products => products.map(item => {
          return {
            ...item,
            taxes: .19 * item.price
          }
        }))
      );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip( // El zip realiza todo en paralelo.
      this.getProduct(id),
      this.update(id, dto)
    );
  }

  getProduct(id: string) {
    return this.httpClient.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            return throwError('Algo está fallando en el server');
          }
          if (error.status === HttpStatusCode.NotFound) {
            return throwError('El producto no existe');
          }
          if (error.status === HttpStatusCode.Unauthorized) {
            return throwError('No estas permitido');
          }
          return throwError('Ups algo salio mal...');
        })
      );
  }

  getProductsByPage(limit: number, offset: number) {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`, {
      params: {limit, offset}
    });
  }

  create(dto: CreateProductDTO) {
    return this.httpClient.post<Product>(`${this.apiUrl}/products`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.httpClient.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
