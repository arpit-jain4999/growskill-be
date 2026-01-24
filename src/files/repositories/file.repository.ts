import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInfo, FileInfoDocument } from '../../common/schemas/file.schema';

@Injectable()
export class FileRepository {
  constructor(
    @InjectModel(FileInfo.name) private fileModel: Model<FileInfoDocument>,
  ) {}

  async create(fileData: Partial<FileInfo>): Promise<FileInfoDocument> {
    return this.fileModel.create(fileData);
  }

  async findById(id: string): Promise<FileInfoDocument | null> {
    return this.fileModel.findById(id);
  }
}

