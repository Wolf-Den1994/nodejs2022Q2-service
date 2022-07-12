import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response, Request } from 'express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly prodictsService: ProductsService) {}

  // @Get()
  // // @Redirect('https://google.com', 301)
  // getAll(@Req() req: Request, @Res() res: Response) {
  //   res.status(201).end('Bye');
  //   return 'getAll';
  // }

  @Get()
  getAll() {
    return this.prodictsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.prodictsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(@Body() createProductDto: CreateProductDto) {
    return this.prodictsService.create(createProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prodictsService.remove(id);
  }

  @Put(':id')
  update(@Body() updateProductDto: UpdateProductDto, @Param('id') id: string) {
    return this.prodictsService.update(id, updateProductDto);
  }
}
