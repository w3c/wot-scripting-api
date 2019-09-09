export as namespace WoT;

/**
 * The WoT interface defines the API entry point exposed as a singleton and contains the API methods.
 */
export interface WoT {
    /**
     * Starts the discovery process that will provide ConsumedThing 
     * 
     * @param filter represents the constraints for discovering Things as key-value pairs
     */
    discover(filter?: ThingFilter): ThingDiscovery;

    /**
     * Accepts a ThingDescription and returns a ConsumedThing
     * @param td thing description
     */
    consume(td: ThingDescription): Promise<ConsumedThing>;

    /**
     * Accepts a ThingDescription and returns a ExposedThing
     * 
     * @param td thing description 
     */
    produce(td: ThingDescription): Promise<ExposedThing>;
}

/**
 * Dictionary that represents the constraints for discovering Things as key-value pairs. 
 */
export interface ThingFilter {
    /**
     * The method field represents the discovery type that should be used in the discovery process. The possible values are defined by the DiscoveryMethod enumeration that can be extended by string values defined by solutions (with no guarantee of interoperability). 
     */
    method?: DiscoveryMethod | string; // default value "any", DOMString
    /**
     * The url field represents additional information for the discovery method, such as the URL of the target entity serving the discovery request, such as a Thing Directory or a Thing.
     */
    url?: string;
    /**
     * The query field represents a query string accepted by the implementation, for instance a SPARQL query. 
     */
    query?: string;
    /**
     * The fragment field represents a template object used for matching against discovered Things.
     */
    fragment?: object;
}

/** The DiscoveryMethod enumeration represents the discovery type to be used */
export declare enum DiscoveryMethod {
    /** does not restrict */
    "any",
    /** for discovering Things defined in the same Servient */
    "local",
    /** for discovery based on a service provided by a Thing Directory */
    "directory",
    /** for discovering Things in the same/reachable network by using a supported multicast protocol */
    "multicast"
}

/**
 * The ThingDiscovery object is constructed given a filter and provides the properties and methods
 * controlling the discovery process. 
 */
export interface ThingDiscovery {
    filter?: ThingFilter;
    active: boolean;
    done: boolean;
    error?: Error;
    start(): void;
    next(): Promise<ThingDescription>;
    stop(): void;
}


/**
 * WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
 * In this version of the API, Thing Descriptions is expected to be a parsed JSON object.
 */
export declare type ThingDescription = object | { [key: string]: any; };


/**
 * The ConsumedThing interface instance represents a client API to operate a Thing.
 */
export interface ConsumedThing {
    readProperty(propertyName: string, options?: InteractionOptions): Promise<any>;
    readAllProperties(options?: InteractionOptions): Promise<PropertyValueMap>;
    readMultipleProperties(propertyNames: string[], options?: InteractionOptions): Promise<PropertyValueMap>;
    writeProperty(propertyName: string, value: any, options?: InteractionOptions): Promise<void>;
    writeMultipleProperties(valueMap: PropertyValueMap, options?: InteractionOptions): Promise<void>;

    invokeAction(actionName: string, params?: any, options?: InteractionOptions): Promise<any>;

    observeProperty(name: string, listener: WotListener, options?: InteractionOptions): Promise<string>;
    unobserveProperty(subscriptionId: string): Promise<void>;

    subscribeEvent(name: string, listener: WotListener, options?: InteractionOptions): Promise<string>;
    unsubscribeEvent(subscriptionId: string): Promise<void>;

    getThingDescription(): ThingDescription;
}

export interface InteractionOptions {
    uriVariables: object;
}

export declare type PropertyValueMap = object | { [key: string]: any; };

export declare type WotListener = (data: any) => void;


/**
 * The ExposedThing interface is the server API to operate the Thing that allows defining request handlers, Property, Action, and Event interactions.
 **/
export interface ExposedThing extends ConsumedThing {
    /**
     * Start serving external requests for the Thing, so that WoT Interactions using Properties, Actions and Events will be possible.
     */
    expose(): Promise<void>;

    /**
     * Stop serving external requests for the Thing and destroy the object. Note that eventual unregistering should be done before invoking this method.
     */
    destroy(): Promise<void>;

    /**
     * Takes name as string argument and handler as argument of type PropertyReadHandler.
     * Sets the handler function for reading the specified Property matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setPropertyReadHandler(name: string, handler: PropertyReadHandler): ExposedThing;

    /**
     * Takes name as string argument and handler as argument of type PropertyWriteHandler.
     * Sets the handler function for writing the specified Property matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setPropertyWriteHandler(name: string, handler: PropertyWriteHandler): ExposedThing;

    /**
     * Takes name as string argument and handler as argument of type ActionHandler.
     * Sets the handler function for the specified Action matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setActionHandler(name: string, handler: ActionHandler): ExposedThing;

    emitEvent(name: string, data: any): void;
}

export declare type PropertyReadHandler = (options?: InteractionOptions) => Promise<any>;

export declare type PropertyWriteHandler = (value: any, options?: InteractionOptions) => Promise<any>;

export declare type ActionHandler = (params: any, options?: InteractionOptions) => Promise<any>;
