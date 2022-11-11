import {Component, OnInit} from '@angular/core';
import {zip} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {CreateProductDTO, Product, UpdateProductDTO} from "../../models/product.model";
import {StoreService} from "../../services/store.service"
import {ProductsService} from "../../services/products.service"

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product [] = [];
  total = 0;
  products: Product [] = [];
  showProductDetail = false;
  productChosen: Product = {
    id:'',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: ''
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';


  constructor(private storeService: StoreService, private productsService: ProductsService) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10, 0)
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.productsService.getProduct(id)
      .subscribe(data => {
        this.toggleProductDetail();
        this.productChosen = data;
        this.statusDetail = 'success';
      }, errorMsg => {
        window.alert(errorMsg);
        this.statusDetail = 'error';
      });
  }

  readAndUpdate(id: string) {
    this.productsService.getProduct(id)
      .pipe(
        // El switchMap es dependiendo una de otra
        switchMap((product) =>
          this.productsService.update(product.id, {title: 'change'}))
      )
      .subscribe(data => {
        console.log(data);
      });
    this.productsService.fetchReadAndUpdate(id, {title: 'change'})
      .subscribe(response => {
        const read = response[0];
        const update = response[1];
      });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'bla bla bla',
      images: ['https://placeimg.com/640/480/any'],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product)
      .subscribe(data => {
        this.products.unshift(data);
      });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Nuevo title',
    };

    const id = this.productChosen.id;
    this.productsService.update(id, changes)
      .subscribe(data => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products[productIndex] = data;
        this.productChosen = data;
      });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id)
      .subscribe(() => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }

}
