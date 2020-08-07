import { EventEmitter } from './EventEmitter';
interface WaitingToSave {
    type: string;
    data: object;
}
export declare class Store extends EventEmitter {
    readonly model: any;
    route: string;
    getParams: any;
    waitingToSave: WaitingToSave[];
    logging: boolean;
    objects: any[];
    current: any;
    hydrated: boolean;
    initLoaded: boolean;
    ready: boolean;
    fetchingData: boolean;
    fetchDataFailed: boolean;
    fetchDataSuccess: boolean;
    defaultFetchDataFailedMessage: string;
    savingData: boolean;
    saveSuccess: boolean;
    saveFailed: boolean;
    deleteSuccess: boolean;
    deleteFailed: boolean;
    deleteFailedMessage: string;
    private deleteTimer;
    constructor(model: any);
    refreshData(): Promise<void>;
    retrySave(): Promise<void>;
    initLoad(): Promise<void>;
    setHydrated(): void;
    checkIsLoaded(): void;
    afterLoad(): void;
    isReady(): void;
    afterHydrate(): void;
    getData(url?: string): Promise<any>;
    create(data: any): Promise<any>;
    update(data: any): Promise<any>;
    delete(id: number): Promise<void>;
    saveCurrent(dontReset?: boolean): Promise<any>;
    createCurrent(dontReset?: boolean): Promise<any>;
    updateCurrent(dontReset?: boolean): Promise<any>;
    deleteCurrent(): Promise<void>;
    resetCurrent(): void;
    setCurrent(item?: any): void;
    setSaveSuccess(): void;
    setSaveFailed(obj: WaitingToSave): void;
    getById(id: number): Promise<any>;
    getByIdSync(id: number): any;
    getMultipleById(ids: any[]): any[];
    search(obj: any): Promise<any>;
    constructGetParams(obj: any): string;
    cleanObject(obj: any): any;
    addObject(obj: any): void;
    removeObject(obj: any): void;
}
export {};
//# sourceMappingURL=base.mobx.d.ts.map