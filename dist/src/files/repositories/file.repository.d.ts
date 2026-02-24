import { Model } from 'mongoose';
import { FileInfo, FileInfoDocument } from '../../common/schemas/file.schema';
export declare class FileRepository {
    private fileModel;
    constructor(fileModel: Model<FileInfoDocument>);
    create(fileData: Partial<FileInfo>): Promise<FileInfoDocument>;
    findById(id: string): Promise<FileInfoDocument | null>;
}
