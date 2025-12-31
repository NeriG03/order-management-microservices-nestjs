import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.save(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      select: ['id', 'name'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoriesRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id },
      select: ['id', 'name'],
    });
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found after update`);
    }
    return updatedCategory;
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoriesRepository.delete(id);
    return { success: true, message: `Category with ID ${id} deleted successfully` };
  }
}
