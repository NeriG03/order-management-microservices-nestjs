import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { CategoryServiceClient } from 'src/types/proto/categories';
import { CATEGORIES_PACKAGE_NAME, CATEGORY_SERVICE_NAME } from 'src/types/proto/categories';
import * as CreateCategoryDtoNamespace from './dto/create-category.dto';
import * as UpdateCategoryDtoNamespace from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController implements OnModuleInit {
  private categoriesService: CategoryServiceClient;
  constructor(@Inject(CATEGORIES_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.categoriesService = this.client.getService<CategoryServiceClient>(CATEGORY_SERVICE_NAME);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDtoNamespace.CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.getCategories({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.getCategory({ categoryId: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDtoNamespace.UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory({
      categoryId: +id,
      ...updateCategoryDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.deleteCategory({ categoryId: +id });
  }
}
