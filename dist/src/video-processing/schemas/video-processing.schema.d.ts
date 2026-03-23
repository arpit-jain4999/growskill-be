import { Document, Types } from 'mongoose';
export type VideoProcessingDocument = VideoProcessing & Document;
export declare const VIDEO_PROCESSING_STATUS: {
    readonly PENDING: "pending";
    readonly PROCESSING: "processing";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
};
export type VideoProcessingStatus = (typeof VIDEO_PROCESSING_STATUS)[keyof typeof VIDEO_PROCESSING_STATUS];
export declare class VideoProcessing {
    sourceFileId: Types.ObjectId;
    status: VideoProcessingStatus;
    masterPlaylistUrl?: string;
    chapterId?: Types.ObjectId;
    moduleId?: Types.ObjectId;
    errorMessage?: string;
    durationSeconds?: number;
}
export declare const VideoProcessingSchema: import("mongoose").Schema<VideoProcessing, import("mongoose").Model<VideoProcessing, any, any, any, (Document<unknown, any, VideoProcessing, any, import("mongoose").DefaultSchemaOptions> & VideoProcessing & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, VideoProcessing, any, import("mongoose").DefaultSchemaOptions> & VideoProcessing & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, VideoProcessing>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VideoProcessing, Document<unknown, {}, VideoProcessing, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    sourceFileId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    status?: import("mongoose").SchemaDefinitionProperty<VideoProcessingStatus, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    masterPlaylistUrl?: import("mongoose").SchemaDefinitionProperty<string, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    chapterId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    moduleId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    errorMessage?: import("mongoose").SchemaDefinitionProperty<string, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    durationSeconds?: import("mongoose").SchemaDefinitionProperty<number, VideoProcessing, Document<unknown, {}, VideoProcessing, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VideoProcessing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, VideoProcessing>;
export interface VideoProcessingDoc extends VideoProcessing {
    createdAt?: Date;
    updatedAt?: Date;
}
