export declare class Service {
    static isLoggedIn: boolean;
    static baseUrl: string;
    static ajax: import("axios").AxiosInstance;
    static get(url: string, headers?: {}): Promise<any>;
    static post(url: string, data?: {}, headers?: {}, many?: boolean): Promise<any>;
    static update(url: string, data: any, headers?: {}): Promise<any>;
    static delete(url: string, id: number, headers?: {}): Promise<{
        id: number;
        error?: undefined;
    } | {
        error: any;
        id?: undefined;
    }>;
    static setBaseUrl(url: string): void;
    static setBearerToken(token: string): void;
}
//# sourceMappingURL=service.d.ts.map