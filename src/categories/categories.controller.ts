import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get('seeder')
  addCategories() {
    return this.categoriesService.addCategories();
  }

  @Get(':name')
  getCategoryByName(@Param('name') name: string) {
    return this.categoriesService.getCategoryByName(name);
  }

  @Post()
  addCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.addCategory(category);
  }

  @Put(':id')
  updateCategory(@Param('id', ParseUUIDPipe) id: string, @Body() category: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, category);
  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
