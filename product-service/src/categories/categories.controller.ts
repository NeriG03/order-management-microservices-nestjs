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
  getCategory(
    request: GetCategoryIDReq,
  ): Promise<CategoryRes> | Observable<CategoryRes> | CategoryRes {
    throw new Error('Method not implemented.');
  }
  getCategories(
    request: GetCategoriesReq,
  ): Promise<CategoryListRes> | Observable<CategoryListRes> | CategoryListRes {
    throw new Error('Method not implemented.');
  }
  createCategory(
    request: CreateCategoryReq,
  ): Promise<CategoryRes> | Observable<CategoryRes> | CategoryRes {
    throw new Error('Method not implemented.');
  }
  updateCategory(
    request: UpdateCategoryReq,
  ): Promise<CategoryRes> | Observable<CategoryRes> | CategoryRes {
    throw new Error('Method not implemented.');
  }
  deleteCategory(
    request: GetCategoryIDReq,
  ): Promise<DeleteCategoryRes> | Observable<DeleteCategoryRes> | DeleteCategoryRes {
    throw new Error('Method not implemented.');
  }
}
