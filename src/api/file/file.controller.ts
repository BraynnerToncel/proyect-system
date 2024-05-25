import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  BadRequestException,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { allMediaMimeTypes } from '@constant/mediaType/mediaMimeTypes.constant';
import { ValidPermission } from '@constant/permissions/permissions.constant';
import { PermissionRequired } from '@decorator/permission.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @PermissionRequired(ValidPermission.settings_files_read)
  async findAll() {
    return await this.fileService.findAll();
  }
  @Get(':fileName/:fileType')
  @PermissionRequired(ValidPermission.settings_files_read)
  async findOne(
    @Param('fileName') fileName: string,
    @Param('fileType') fileType: string,
  ) {
    return await this.fileService.findOne({ fileName, fileType });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (allMediaMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Only video or image formats are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  @PermissionRequired(ValidPermission.settings_files_create)
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    return await this.fileService.createOrUpdateFile(file, false);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (allMediaMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Only video or image formats are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  @PermissionRequired(ValidPermission.settings_files_update)
  async updateFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file :>> ', file);
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    return await this.fileService.createOrUpdateFile(file, true);
  }

  @Delete(':fileName/:fileType')
  @PermissionRequired(ValidPermission.settings_files_delete)
  async remove(
    @Param('fileName') fileName: string,
    @Param('fileType') fileType: string,
  ) {
    return await this.fileService.remove({ fileName, fileType });
  }
}
