import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products = [];

  async getAll() {
    return this.products;
  }

  async getById(id: string) {
    return this.products.find((p) => p.id === id);
  }

  async create(productDto: CreateProductDto) {
    const newProduct = {
      ...productDto,
      id: Date.now().toString(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async remove(id: string) {
    return this.products.filter((p) => p.id !== id);
  }

  async update(id: string, productDto: UpdateProductDto) {}
}
