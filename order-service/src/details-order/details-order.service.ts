import { Injectable } from '@nestjs/common';
import { CreateDetailsOrderDto } from './dto/create-details-order.dto';
import { UpdateDetailsOrderDto } from './dto/update-details-order.dto';

@Injectable()
export class DetailsOrderService {
  create(createDetailsOrderDto: CreateDetailsOrderDto) {
    return 'This action adds a new detailsOrder';
  }

  findAll() {
    return `This action returns all detailsOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailsOrder`;
  }

  update(id: number, updateDetailsOrderDto: UpdateDetailsOrderDto) {
    return `This action updates a #${id} detailsOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailsOrder`;
  }
}
