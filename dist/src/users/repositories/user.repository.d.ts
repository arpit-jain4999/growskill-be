import { Model } from 'mongoose';
import { User, UserDocument } from '../../auth/schemas/user.schema';
export declare class UserRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserDocument | null>;
    update(id: string, updateData: Partial<User>): Promise<UserDocument | null>;
}
