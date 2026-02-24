declare class FileInfoDto {
    _id: string;
    name: string;
    key: string;
    baseUrl: string;
    imgUrl: string;
}
export declare class CohortIconDto {
    mobile?: FileInfoDto;
    web?: FileInfoDto;
}
export declare class CohortResponseDto {
    _id: string;
    name: string;
    icon?: CohortIconDto;
    displayOrder: number;
    countryCode: string;
    isVisibleOnHomePage: boolean;
    description?: string;
}
export declare class CohortListResponseDto {
    cohorts: CohortResponseDto[];
}
export {};
