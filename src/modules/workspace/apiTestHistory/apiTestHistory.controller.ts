import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';
import { ApiTestHistoryService } from './apiTestHistory.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';
import { IUser, User } from '@/common/decorators/user.decorator';

@ApiTags('apiTestHistory')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/api_test_history`)
export class ApiTestHistoryController {
  private readonly JSON_FIELDS = ['general', 'request', 'response'];

  constructor(private readonly service: ApiTestHistoryService) {}

  @Post()
  async create(
    @Body() createDto: CreateDto,
    @Param('projectID') projectID,
    @User() user: IUser,
  ) {
    const data = await this.service.create({
      ...createDto,
      projectID,
      createBy: user.userId,
      updateBy: user.userId,
    });
    return await this.findOne(`${data.uuid}`, projectID);
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>, @User() user: IUser) {
    createDto.map((val) => {
      this.JSON_FIELDS.forEach((field) => {
        if (val[field]) {
          val[field] = JSON.stringify(val[field]);
        }
      });
      val.createBy = user.userId;
      val.updateBy = user.userId;
      return val;
    });
    return this.service.batchCreate(createDto);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Param('projectID') projectID,
    @User() user: IUser,
  ) {
    return this.service.findAll([
      { ...query, projectID, createBy: user.userId },
      { ...query, projectID, updateBy: user.userId },
    ]);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string, @Param('projectID') projectID) {
    return this.service.findOne(+uuid, projectID);
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateDto,
    @Param('projectID') projectID,
  ) {
    this.JSON_FIELDS.forEach((field) => {
      if (updateDto[field]) {
        updateDto[field] = JSON.stringify(updateDto[field]);
      }
    });
    await this.service.update(+uuid, updateDto);
    return await this.findOne(uuid, projectID);
  }

  @Delete()
  async remove(@Query(ValidateQueryPipe) query) {
    return await this.service.remove(query.uuids);
  }
}
