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
export declare type ThingDescription = { [key: string]: any; };


export declare type DataSchemaValue = any;
export declare type InteractionInput = (ReadableStream | DataSchemaValue);

export interface InteractionOutput {
    data?: ReadableStream;
    dataUsed: boolean;
    form?: Form;
    schema?: DataSchema;
    arrayBuffer(): Promise<ArrayBuffer>;
    value(): Promise<any>;
}

/**
 * The ConsumedThing interface instance represents a client API to operate a Thing.
 */
export interface ConsumedThing {
    /**
     * Reads a Property value.
     * Takes as arguments propertyName and optionally options.
     * It returns a Promise that resolves with a Property value represented as an
     * InteractionOutput object or rejects on error.
     */
    readProperty(propertyName: string, options?: InteractionOptions): Promise<InteractionOutput>;

    /**
     * Reads all properties of the Thing with one or multiple requests.
     * Takes options as optional argument.
     * It returns a Promise that resolves with a PropertyMap object that
     * maps keys from Property names to values.
     */
    readAllProperties(options?: InteractionOptions): Promise<PropertyMap>;

    /**
     * Reads multiple Property values with one or multiple requests.
     * Takes as arguments propertyNames and optionally options.
     * It returns a Promise that resolves with a PropertyMap object that
     * maps keys from propertyNames to values
     */
    readMultipleProperties(propertyNames: string[], options?: InteractionOptions): Promise<PropertyMap>;

    /**
     * Writes a single Property.
     * Takes as arguments propertyName, value and optionally options.
     * It returns a Promise that resolves on success and rejects on failure.
     */
    writeProperty(propertyName: string, value: InteractionInput, options?: InteractionOptions): Promise<void>;

    /**
     * Writes a multiple Property values with one request.
     * Takes as arguments properties - as an object with keys being Property names
     * and values as Property values - and optionally options.
     * It returns a Promise that resolves on success and rejects on failure.
     */
    writeMultipleProperties(valueMap: PropertyMap, options?: InteractionOptions): Promise<void>;

    /**
     * Makes a request for invoking an Action and return the result.
     * Takes as arguments actionName, optionally params and optionally options.
     * It returns a Promise that resolves with the result of the Action represented
     * as an InteractionOutput object, or rejects with an error.
     */
    invokeAction(actionName: string, params?: InteractionInput, options?: InteractionOptions): Promise<InteractionOutput>;

    /**
     * Makes a request for Property value change notifications.
     * Takes as arguments propertyName, listener and optionally options.
     * It returns a Promise that resolves on success and rejects on failure. 
     */
    observeProperty(name: string, listener: WotListener, options?: InteractionOptions): Promise<void>;

    /**
     * Makes a request for Property value change notifications.
     * Takes as arguments propertyName, listener and optionally options.
     * It returns a Promise that resolves on success and rejects on failure.
     */
    unobserveProperty(name: string): Promise<void>;

    /**
     * Makes a request for subscribing to Event notifications.
     * Takes as arguments eventName, listener and optionally options.
     * It returns a Promise to signal success or failure.
     */
    subscribeEvent(name: string, listener: WotListener, options?: InteractionOptions): Promise<void>;

    /**
     * Makes a request for unsubscribing from Event notifications.
     * Takes as arguments eventName and optionally options.
     * It returns a Promise to signal success or failure.
     */
    unsubscribeEvent(name: string): Promise<void>;

    /**
     * Returns the the object that represents the Thing Description.
     */
    getThingDescription(): ThingDescription;
}

export interface InteractionOptions {
    formIndex?: number;
    uriVariables?: object;
    data?: any;
}

export declare type PropertyMap = object | { [key: string]: any; };

export declare type WotListener = (data: InteractionOutput) => void;

export interface InteractionData {
    data?: ReadableStream;
    dataUsed: boolean;
    form?: Form;
    schema?: DataSchema;
    arrayBuffer(): Promise<ArrayBuffer>;
    value(): Promise<any>;
}

export declare type Form = { [key: string]: any; };
export declare type DataSchema = { [key: string]: any; };

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
     * Takes as arguments name and handler.
     * Sets the service handler that defines what to do when a request is received for
     * observing the specified Property matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setPropertyObserveHandler(name: string, handler: PropertyReadHandler): ExposedThing;

    /**
     * Takes as arguments name and handler.
     * Sets the service handler that defines what to do when a request is received for
     * unobserving the specified Property matched by name. 
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setPropertyUnobserveHandler(name: string, handler: PropertyReadHandler): ExposedThing;

    /**
     * Takes name as string argument and handler as argument of type ActionHandler.
     * Sets the handler function for the specified Action matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setActionHandler(name: string, handler: ActionHandler): ExposedThing;

    /**
     * Takes as arguments name and handler.
     * Sets the handler function that defines what to do when a subscription request
     * is received for the specified Event matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setEventSubscribeHandler(name: string, handler: EventSubscriptionHandler): ExposedThing;

    /**
     * Takes as arguments name and handler.
     * Sets the handler function that defines what to do when the specified Event
     * matched by name is unsubscribed from.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setEventUnsubscribeHandler(name: string, handler: EventSubscriptionHandler): ExposedThing;

    /**
     * Takes as arguments name and eventHandler.
     * Sets the event handler function for the specified Event matched by name.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    setEventHandler(name: string, handler: EventListenerHandler): ExposedThing;

    /**
     * Takes as arguments name denoting an Event name and data.
     * Triggers emitting the Event with the given data. 
     */
    emitEvent(name: string, data: InteractionInput): void;
}

export declare type PropertyReadHandler = (options?: InteractionOptions) => Promise<any>;

export declare type PropertyWriteHandler = (value: InteractionOutput, options?: InteractionOptions) => Promise<any>;

export declare type ActionHandler = (params: InteractionOutput, options?: InteractionOptions) => Promise<InteractionInput>;

export declare type EventSubscriptionHandler = (options?: InteractionOptions) => Promise<void>;

export declare type EventListenerHandler = () => Promise<InteractionInput>;
