import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Public } from '@decorator/routes-public.decorator';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}
  @Public()
  @Post(':userDelivery')
  create(
    @Param('userDelivery') userDelivery: string,
    @Body() createLoanDto: CreateLoanDto,
  ) {
    return this.loanService.create(userDelivery, createLoanDto);
  }
  @Public()
  @Get('list')
  findAll() {
    return this.loanService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(id);
  }
  @Public()
  @Put(':userRe/state')
  update(
    @Param('userRe') userRe: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ) {
    return this.loanService.update(userRe, updateLoanDto);
  }
}
