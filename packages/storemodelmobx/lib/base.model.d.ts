interface Test {
    [key: string]: any;
}
export declare class Model implements Test {
    id: number;
    route: string;
    getParams: any;
    original: any;
    objectKey: string;
    originalPropsToDeleteForSave: string[];
    propsToDeleteForSave: string[];
    clearFlagTime: number;
    editable: boolean;
    fetchingData: boolean;
    fetchFailed: boolean;
    fetchSuccess: boolean;
    savingData: boolean;
    saveSuccess: boolean;
    saveFailed: boolean;
    deletingData: boolean;
    deleteSuccess: boolean;
    deleteFailed: boolean;
    constructor(data?: any);
    init(data: any): void;
    convertForSave(data?: any): object;
    convertFromLoad(): void;
    reset(): void;
    save(): Promise<void>;
    create(): Promise<void>;
    update(): Promise<void>;
    delete(): Promise<void>;
    refresh(): Promise<void>;
    clearFlags(): void;
    constructGetParams(obj?: any): string;
    getDataFromStores(): void;
}
export {};
//# sourceMappingURL=base.model.d.ts.map