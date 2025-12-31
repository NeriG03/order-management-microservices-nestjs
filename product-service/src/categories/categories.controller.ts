import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryListRes,
  CategoryRes,
  CategoryServiceController,
  CreateCategoryReq,
  DeleteCategoryRes,
  GetCategoriesReq,
  GetCategoryIDReq,
  UpdateCategoryReq,
} from 'src/types/proto/categories';
import { Observable } from 'rxjs';

@Controller()
export class CategoriesController implements CategoryServiceController {
  constructor(private readonly categoriesService: CategoriesService) {}

  async getCategory(request: GetCategoryIDReq): Promise<CategoryRes> {
    const category = await this.categoriesService.findOne(request.categoryId);
    return {
      categoryId: category.id,
      name: category.name,
    };
  }

  async getCategories(request: GetCategoriesReq): Promise<CategoryListRes> {
    const categories = await this.categoriesService.findAll();
    return {
      categories: categories.map(category => ({
        categoryId: category.id,
        name: category.name,
      })),
    };
  }

  async createCategory(request: CreateCategoryReq): Promise<CategoryRes> {
    const category = await this.categoriesService.create({
      name: request.name,
    });
    return {
      categoryId: category.id,
      name: category.name,
    };
  }

  async updateCategory(request: UpdateCategoryReq): Promise<CategoryRes> {
    const category = await this.categoriesService.update(request.categoryId, {
      name: request.name,
    });
    return {
      categoryId: category.id,
      name: category.name,
    };
  }

  async deleteCategory(request: GetCategoryIDReq): Promise<DeleteCategoryRes> {
    const result = await this.categoriesService.remove(request.categoryId);
    return {
      success: result.success,
      message: result.message,
    };
  }
}
