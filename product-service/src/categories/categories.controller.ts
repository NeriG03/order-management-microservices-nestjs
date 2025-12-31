import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoryListRes,
  CategoryRes,
  CategoryServiceController,
  CategoryServiceControllerMethods,
  CreateCategoryReq,
  DeleteCategoryRes,
  GetCategoriesReq,
  GetCategoryIDReq,
  UpdateCategoryReq,
} from 'src/types/proto/categories';

@Controller()
@CategoryServiceControllerMethods()
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
