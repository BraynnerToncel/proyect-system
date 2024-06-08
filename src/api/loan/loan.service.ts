import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  create(createLoanDto: CreateLoanDto) {
    return 'This action adds a new loan';
  }

  findAll() {
    return `This action returns all loan`;
  }

  findOne(id: string) {
    return `This action returns a #${id} loan`;
  }

  update(id: string, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }
}
