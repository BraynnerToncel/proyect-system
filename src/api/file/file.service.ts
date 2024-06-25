import {
  IDeleteFile,
  IFile,
  IFindOneFile,
} from '@interface/api/file/file.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import * as os from 'os';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  private readonly availablePaths: Array<string> = ['image', 'video'];
  private readonly serverIp: string;
  @InjectRepository(File)
  private readonly fileRepository: Repository<File>;

  constructor() {
    const networkInterfaces = os.networkInterfaces();
    this.serverIp = Object.values(networkInterfaces)
      .flat()
      .filter(({ family, internal }) => family === 'IPv4' && !internal)
      .map(({ address }) => address)[0];
  }
  onModuleInit() {
    this.availablePaths.forEach((folder) => {
      const path: string = join(process.env.STORE_FILES_PATH, folder);
      if (!existsSync(path)) mkdirSync(path);
    });
  }
  async createOrUpdateFile(files: Express.Multer.File, isUpdate: boolean) {
    console.log('object');
    const filesType: string = files.mimetype.split('/')[0];
    const path: string = join(process.env.STORE_FILES_PATH, filesType);
    const filePath: string = join(path, files.originalname);

    const url = `${process.env.SERVER_PROTOCOL}://${this.serverIp}:${process.env.PORT}/static/${filesType}/${files.originalname}`;
    if (isUpdate && !existsSync(filePath)) {
      throw new BadRequestException('File does not exist. Cannot update.');
    } else if (!isUpdate && existsSync(filePath)) {
      throw new BadRequestException('File already exists. Cannot create.');
    }

    const dataFile: IFile = {
      fileName: files.originalname,
      fileType: filesType,
      fileLength: files.size,
      fileUrl: url,
    };
    const newFile = this.fileRepository.create(dataFile as DeepPartial<File>);
    await this.fileRepository.save(newFile);
    writeFileSync(filePath, files.buffer);

    return dataFile;
  }

  async findAll(): Promise<Array<IFile>> {
    const allFiles: Array<IFile> = [];

    this.availablePaths.forEach((folder) => {
      const path: string = join(process.env.STORE_FILES_PATH, folder);

      if (!existsSync(path)) {
        throw new BadRequestException(`The directory ${path} does not exist.`);
      }

      const files = readdirSync(path);

      files.forEach((fileName) => {
        const filePath: string = join(path, fileName);
        const stats = statSync(filePath);
        const url = `${process.env.SERVER_PROTOCOL}://${this.serverIp}:${process.env.PORT}/static/${folder}/${fileName}`;

        const dataFile = {
          fileName,
          fileLength: stats.size,
          fileUrl: url,
          fileType: folder,
        };

        allFiles.push(dataFile);
      });
    });

    return allFiles;
  }

  async findOne({ fileName, fileType }: IFindOneFile): Promise<IFile> {
    const path: string = join(process.env.STORE_FILES_PATH, fileType);
    const filePath: string = join(path, fileName);

    if (!existsSync(filePath)) {
      throw new BadRequestException(
        `File ${fileName} does not exist in ${fileType} directory.`,
      );
    }
    const stats = statSync(filePath);
    const url = `${process.env.SERVER_PROTOCOL}://${this.serverIp}:${process.env.PORT}/static/${fileType}/${fileName}`;

    return {
      fileName,
      fileLength: stats.size,
      fileUrl: url,
      fileType,
    };
  }
  async remove({ fileType, fileName }: IDeleteFile): Promise<IDeleteFile> {
    const path: string = join(process.env.STORE_FILES_PATH, fileType);
    if (existsSync(join(path, fileName))) {
      unlinkSync(join(path, fileName));
    } else {
      throw new BadRequestException(
        ` el archivo no existe no se puede eliminar `,
      );
    }
    return { fileType, fileName };
  }
}
