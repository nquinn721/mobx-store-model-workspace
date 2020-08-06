# Store

## loaded data from server

objects: any[];

## load flags

hydrated: boolean;
initLoaded: boolean;
ready: boolean;

## fetch flags

fetchingData: boolean;
fetchDataFailed: boolean;
fetchDataSuccess: boolean;
defaultFetDataFailedMessage: string;

## save flags

savingData: boolean;
saveSuccess: boolean;
saveFailed: boolean;

## delete flags

deleteSuccess: boolean;
deleteFailed: boolean;
deleteFailedMessage: string;

## requires a class (it gets instantiated)

constructor(model: any);

## calls initLoad

refreshData(): Promise<void>;

## calls get data and puts data on objects

initLoad(): Promise<void>;

## called after loaded from endpoint

afterLoad(): void;

## called after hydrated and loaded

isReady(): {};

## called after hydrate from localstorage

afterHydrate(): {};

## calls get endpoint

getData(url?: string): Promise<any>;

## calls create endpoint

create(data: any): Promise<any>;

## calls update endpoint

update(data: any): Promise<any>;

## calls delete endpoint

delete(id: number): Promise<void>;

## checks if id exists, if so calls updateCurrent else createCurrent

## if passed false does not call resetCurrent

saveCurrent(dontReset?: boolean): Promise<any>;

## sends post to create, calls resetCurrent, addObject

## if passed false does not call resetCurrent

createCurrent(dontReset?: boolean): Promise<any>;

## sends post to update, calls resetCurrent, addObject

## if passed false does not call resetCurrent

updateCurrent(dontReset?: boolean): Promise<any>;

## sends post to delete, calls resetCurrent

deleteCurrent(): Promise<void>;

## resets current to empty model

resetCurrent(): void;

## sets current with new model and object passed to it

setCurrent(item?: any): void;

## searches objects and calls getData for id

## useful incase the object isn't in objects

getById(id: number): Promise<any>;

## searches objects by id

getByIdSync(id: number): any;

## searches objects by list of ids

getMultipleById(ids: any[]): any[];

## takes object and hits get endpoint

## {name: 'bob'}

### calls getData

search(obj: any): Promise<any>;

## takes an object and returns query string

## {s: {name: 'bob'}}

## ?s={"name":"bob"}

constructGetParams(obj: any): string;

## deletes any null or undefined properties on an object

cleanObject(obj: any): any;

## adds object to objects

## if object exists in this.objects it will mix with it

addObject(obj: any): void;

## removes object from objects based off id

removeObject(obj: any): void;

# Model
