import { FileInfo } from '../../common/schemas/file.schema';
export declare class UpdateCohortDto {
    name?: string;
    icon?: {
        mobile?: FileInfo;
        web?: FileInfo;
    };
    displayOrder?: number;
    countryCode?: string;
    isVisibleOnHomePage?: boolean;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
}
