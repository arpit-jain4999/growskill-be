export interface CurrentUserPayload {
    userId: string;
    countryCode: string;
    phoneNumber: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
