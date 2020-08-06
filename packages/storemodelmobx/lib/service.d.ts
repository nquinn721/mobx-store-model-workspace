export declare class Service {
    static isLoggedIn: boolean;
    static baseUrl: string;
    static ajax: import("axios").AxiosInstance;
    static get(url: string): Promise<any>;
    static post(url: string, data?: {}, many?: boolean): Promise<any>;
    static update(url: string, data: any): Promise<any>;
    static delete(url: string, id: number): Promise<{
        id: number;
        error?: undefined;
    } | {
        error: any;
        id?: undefined;
    }>;
    static login(creds: object): Promise<any>;
    static logout(): Promise<void>;
    static setBaseUrl(url: string): void;
}
//# sourceMappingURL=service.d.ts.map