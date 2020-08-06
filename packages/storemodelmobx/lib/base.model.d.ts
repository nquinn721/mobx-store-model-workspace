interface Test {
    [key: string]: any;
}
export declare class Model implements Test {
    id: number;
    route: string;
    getParams: any;
    original: any;
    propsToDeleteForSave: string[];
    editable: boolean;
    saved: boolean;
    init(data: any): void;
    convertForSave(data?: any): object;
    convertFromLoad(): void;
    reset(): void;
    save(): Promise<void>;
    create(): Promise<void>;
    update(): Promise<void>;
    delete(): Promise<void>;
    refresh(): Promise<void>;
    constructGetParams(obj: any): string;
    getDataFromStores(): void;
}
export {};
//# sourceMappingURL=base.model.d.ts.map