type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: T[P] extends Array<infer I>
    ? Array<DeepPartial<I>>
    : DeepPartial<T[P]>
} : T;
declare namespace WoT {

    /**
     * Starts the discovery process that will provide {@link ThingDescription}
     * objects for Thing Descriptions that match an optional {@link filter}
     * argument of type {@link ThingFilter}.
     *
     * @param filter represents the constraints for discovering Things as key-value pairs
     */
    export function discover(filter?: ThingFilter): Promise<ThingDiscoveryProcess>;

    /**
     * Starts the discovery process that, given a TD Directory {@link url}, will
     *  provide {@link ThingDescription} objects for Thing Descriptions that
     * match an optional {@link filter} argument of type {@link ThingFilter}.
     *
     * @param url URL pointing to a TD Directory.
     * @param filter represents the constraints for discovering Things as key-value pairs
     */
    export function exploreDirectory(url: string, filter?: ThingFilter): Promise<ThingDiscoveryProcess>;

    /**
     * Requests a {@link ThingDescription} from the given {@link url}.
     *
     * @param url The URL to request the Thing Description from.
     */
    export function requestThingDescription(url: string): Promise<ThingDescription>;

    /**
     * Accepts a ThingDescription and returns a ConsumedThing
     * @param td thing description
     */
    export function consume<T extends ThingDescription>(td: T): Promise<ConsumedThing<T>>;

    /**
     * Accepts an init dictionary similar to a ThingDescription.
     * It returns a ExposedThing
     * 
     * @param ptd Partial thing description 
     */
    export function produce<T extends ExposedThingInit>(init: T): Promise<ExposedThing<T>>;


    /**
     * Dictionary that represents the constraints for discovering Things as key-value pairs. 
     */
    export interface ThingFilter {
        /**
         * The fragment field represents a template object used for matching against discovered Things.
         */
        fragment?: object;
    }

    /**
     * The ThingDiscovery object is constructed given a filter and provides the properties and methods
     * controlling the discovery process. 
     */
    export interface ThingDiscoveryProcess extends AsyncIterable<ThingDescription> {
        filter?: ThingFilter;
        done: boolean;
        error?: Error;
        stop(): void;
    }


    /**
     * WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
     * In this version of the API, Thing Descriptions is expected to be a parsed JSON object.
     */
    export type ThingDescription = import("wot-thing-description-types").ThingDescription;
    export type ExposedThingInit = DeepPartial<ThingDescription>;


    export type DataSchemaValue = (null | boolean | number | string | object | DataSchemaValue[]);
    export type InteractionInput = (ReadableStream | DataSchemaValue);

    export interface InteractionOutput {
        data?: ReadableStream;
        dataUsed: boolean;
        form?: Form;
        schema?: DataSchema;
        arrayBuffer(): Promise<ArrayBuffer>;
        value(): Promise<DataSchemaValue>;
    }

    /**
     * Note: retrieving the result of an action via the implicit InteractionOutput interface will only work after the action has been completed
     */
    export interface ActionInteractionOutput extends InteractionOutput {
        // query the status of a running action
        query(params?: InteractionInput, options?: InteractionOptions): Promise<InteractionOutput>
        // cancel a pending/running action
        cancel(params?: InteractionInput, options?: InteractionOptions): Promise<void>
    }

    export interface Subscription {
        active:boolean,
        stop(options?: InteractionOptions):Promise<void>
    }

    /**
     * The ConsumedThing interface instance represents a client API to operate a Thing.
     */
    export interface ConsumedThing<T extends ThingDescription> {
        /**
         * Reads a Property value.
         * Takes as arguments propertyName and optionally options.
         * It returns a Promise that resolves with a Property value represented as an
         * InteractionOutput object or rejects on error.
         */
        readProperty(propertyName: Extract<keyof NonNullable<T["properties"]>, string>, options?: InteractionOptions): Promise<InteractionOutput>;

        /**
         * Reads all properties of the Thing with one or multiple requests.
         * Takes options as optional argument.
         * It returns a Promise that resolves with a PropertyMap object that
         * maps keys from Property names to values.
         */
        readAllProperties(options?: InteractionOptions): Promise<PropertyReadMap>;

        /**
         * Reads multiple Property values with one or multiple requests.
         * Takes as arguments propertyNames and optionally options.
         * It returns a Promise that resolves with a PropertyMap object that
         * maps keys from propertyNames to values
         */
        readMultipleProperties(propertyNames: Extract<keyof NonNullable<T["properties"]>[], string>[], options?: InteractionOptions): Promise<PropertyReadMap>;

        /**
         * Writes a single Property.
         * Takes as arguments propertyName, value and optionally options.
         * It returns a Promise that resolves on success and rejects on failure.
         */
        writeProperty(propertyName: Extract<keyof NonNullable<T["properties"]>, string>, value: InteractionInput, options?: InteractionOptions): Promise<void>;

        /**
         * Writes a multiple Property values with one request.
         * Takes as arguments properties - as an object with keys being Property names
         * and values as Property values - and optionally options.
         * It returns a Promise that resolves on success and rejects on failure.
         */
        writeMultipleProperties(valueMap: PropertyWriteMap, options?: InteractionOptions): Promise<void>;

        /**
         * Makes a request for invoking an Action and return the result.
         * Takes as arguments actionName, optionally params and optionally options.
         * It returns a Promise that resolves with the result of the Action represented
         * as an ActionInteractionOutput object, or rejects with an error.
         */
        invokeAction(actionName: Extract<keyof NonNullable<T["actions"]>, string>, params?: InteractionInput, options?: InteractionOptions): Promise<undefined | ActionInteractionOutput>;

        /**
         * Makes a request for Property value change notifications.
         * Takes as arguments propertyName, listener and optionally options.
         * It returns a Promise that resolves on success and rejects on failure. 
         */
        observeProperty(name:  Extract<keyof NonNullable<T["properties"]>, string>, listener: WotListener, errorListener?: ErrorListener, options?: InteractionOptions): Promise<Subscription>;

        /**
         * Makes a request for subscribing to Event notifications.
         * Takes as arguments eventName, listener and optionally options.
         * It returns a Promise to signal success or failure.
         */
        subscribeEvent(name: Extract<keyof NonNullable<T["events"]>, string>, listener: WotListener, errorListener?: ErrorListener, options?: InteractionOptions): Promise<Subscription>;

        /**
         * Returns the the object that represents the Thing Description.
         */
        getThingDescription(): T;
    }

    export interface InteractionOptions {
        formIndex?: number;
        uriVariables?: object;
        data?: any;
    }

    export type PropertyReadMap = Map<string, InteractionOutput>;
    export type PropertyWriteMap = Map<string, InteractionInput>;

    export type WotListener = (data: InteractionOutput) => void;
    export type ErrorListener = (error: Error) => void;

    export interface InteractionData {
        data?: ReadableStream;
        dataUsed: boolean;
        form?: Form;
        schema?: DataSchema;
        arrayBuffer(): Promise<ArrayBuffer>;
        value(): Promise<any>;
    }

    export type Form = { [key: string]: any; };
    export type DataSchema = { [key: string]: any; };

    /**
     * The ExposedThing interface is the server API to operate the Thing that allows defining request handlers, Property, Action, and Event interactions.
     **/
    export interface ExposedThing<T extends ExposedThingInit>  {
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
        setPropertyReadHandler(name: Extract<keyof NonNullable<T["properties"]>, string>, handler: PropertyReadHandler): ExposedThing<T>;

        /**
         * Takes name as string argument and handler as argument of type PropertyWriteHandler.
         * Sets the handler function for writing the specified Property matched by name.
         * Throws on error.
         * Returns a reference to the same object for supporting chaining.
         */
        setPropertyWriteHandler(name: Extract<keyof NonNullable<T["properties"]>, string>, handler: PropertyWriteHandler): ExposedThing<T>;

        /**
         * Takes as arguments name and handler.
         * Sets the service handler that defines what to do when a request is received for
         * observing the specified Property matched by name.
         * Throws on error.
         * Returns a reference to the same object for supporting chaining.
         */
        setPropertyObserveHandler(name: Extract<keyof NonNullable<T["properties"]>, string>, handler: PropertyReadHandler): ExposedThing<T>;

        /**
         * Takes as arguments name and handler.
         * Sets the service handler that defines what to do when a request is received for
         * unobserving the specified Property matched by name. 
         * Throws on error.
         * Returns a reference to the same object for supporting chaining.
         */
        setPropertyUnobserveHandler(name: Extract<keyof NonNullable<T["properties"]>, string>, handler: PropertyReadHandler): ExposedThing<T>;
		
        /**
         * Takes as arguments name denoting a Property name.
         * Triggers emitting a notification to all observers. 
         */
        emitPropertyChange(name: Extract<keyof NonNullable<T["properties"]>, string>): void;

        /**
         * Takes name as string argument and handler as argument of type ActionHandler.
         * Sets the handler function for the specified Action matched by name.
         * Throws on error.
         * Returns a reference to the same object for supporting chaining.
         */
        setActionHandler(name: Extract<keyof NonNullable<T["actions"]>, string>, handler: ActionHandler): ExposedThing<T>;

        /**
         * Takes as arguments name and handler.
         * Sets the handler function that defines what to do when a subscription request
         * is received for the specified Event matched by name.
         * Throws on error.
         * Returns a reference to the same object for supporting chaining.
         */
        setEventSubscribeHandler(name: Extract<keyof NonNullable<T["events"]>, string>, handler: EventSubscriptionHandler): ExposedThing<T>;

        /**
         * Takes as arguments name and handler.
         * Sets the handler function that defines what to do when the specified Event
         * matched by name is unsubscribed from.
         * Throws on error.
         * Returns a reference to the same object for supporting chaining.
         */
        setEventUnsubscribeHandler(name: Extract<keyof NonNullable<T["events"]>, string>, handler: EventSubscriptionHandler): ExposedThing<T>;

        /**
         * Takes as arguments name denoting an Event name and optionally data.
         * Triggers emitting the Event with optional data.
         */
        emitEvent(name: Extract<keyof NonNullable<T["events"]>, string>, data?: InteractionInput): void;

        /**
         * Returns the the object that represents the Thing Description.
         */
        getThingDescription(): T;
    }

    export type PropertyReadHandler = (options?: InteractionOptions) => Promise<InteractionInput>;

    export type PropertyWriteHandler = (value: InteractionOutput, options?: InteractionOptions) => Promise<void>;

    export type ActionHandler = (params: InteractionOutput, options?: InteractionOptions) => Promise<undefined | InteractionInput>;

    export type EventSubscriptionHandler = (options?: InteractionOptions) => Promise<void>;

}

declare module "wot-typescript-definitions" {
    export = WoT;
}
