//this NOT part of the spec, but needed to polyfill Observable into TypeScript 
import { Observable } from 'rxjs'

export as namespace wot;

export default wot;

declare let wot: WoTFactory;

export interface WoTFactory {
    discover(filter?: Object): Observable<ConsumedThing>;
    retrieve(url: string): Promise<ConsumedThing>;
    createLocalThing(init: ThingInit): Promise<ConsumedThing>;
}

export interface ThingInit {
    name?: string;
    url?: string;
    description?: object;
}

export declare enum DiscoveryType {
    "any",
    "local",
    "nearby",
    "directory",
    "broadcast",
    "other"
}

export interface ThingFilter extends ThingInit {
    type: string | DiscoveryType
}

export interface ConsumedThing {
    /** name of the Thing */
    readonly name: string

    /** invokes an action on the target thing 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any>

    /**
     * Set a given property
     * @param propertyName Name of the property
     * @param newValue value to be set  
     */
    setProperty(propertyName: string, newValue: any): Promise<void>

    /**
     * Read a given property
     * @param propertyName Name of the property 
     */
    getProperty(propertyName: string): Promise<any>

    addListener(eventName: string, listener: (event: Event) => void): ConsumedThing
    removeListener(eventName: string, listener: (event: Event) => void): ConsumedThing
    removeAllListeners(eventName: string): ConsumedThing

    /**
     * Retrive the thing description for this object
     */
    getDescription(): Object
}

export interface PropertyChangeEvent extends Event {
    readonly data : {
        name : string;
        value : any;
        oldValue: any;
    }
}

export interface ActionInvocationEvent extends Event {
    readonly data : {
        name : string;
        returnValue: any;
    }
}

export interface ThingDescriptionChangeEvent extends Event {
    readonly data : {
        name : string;
        data: ThingPropertyInit | ThingActionInit | ThingEventInit;
        type: TDChangeType;
        method: TDChangeMethod;
    }
}

export declare enum TDChangeMethod {
    "add",
    "remove",
    "change"
}

export declare enum TDChangeType {
    "property",
    "action",
    "event"
}

export interface ExposedThing {
    addProperty(property : ThingPropertyInit): ExposedThing
    removeProperty(propertyName: string): ExposedThing

    addAction(action: ThingActionInit): ExposedThing
    removeAction(actionName: string): ExposedThing
    
    addEvent(event: ThingEventInit): ExposedThing
    removeEvent(eventName: string): ExposedThing

    register(directory? : string) : Promise<void>
    unregister() : Promise<void>

    start() : Promise<void>
    stop() : Promise<void>

    emitEvent(eventName : string, payload : any) : Promise<void>

    // define request handlers (one per request type, so no events here)
     onRetrieveProperty(handler : (req: PropertyRequest) => any) : ExposedThing
     onUpdateProperty(handler : (req : PropertyRequest) => any) : ExposedThing
     onInvokeAction(handler : (req : ActionRequest) => any) : ExposedThing
     onObserve(handler : (req : ObserveRequest) => any) : ExposedThing
}

export interface Request {
    from : string
    options? : object
}

export interface PropertyRequest extends Request {
    property : ThingPropertyInit
}

export interface ActionRequest extends Request {
    action : ThingActionInit
}

export interface ObserveRequest extends Request {
    type : ObserveType
    name? : string
    subscribe? : boolean
}

export declare enum ObserveType {
    "property",
    "action",
    "event",
    "td"
}

export interface SemanticType {
    name : string
    context : string
}

export interface ThingPropertyInit {
    name : string
    configurable : boolean 
    enumerable : boolean
    writable : boolean
    semanticTypes : SemanticType[]
    dataDescription : object
    value?: any
}

export interface ThingActionInit {
    name : string
    inputDataDescription : object
    outputDataDescription : object
    semanticTypes : SemanticType[]
    action: (param : any) => any
}

export interface ThingEventInit {
    name : string
    outputDataDescription : object
    semanticTypes : SemanticType[]
}