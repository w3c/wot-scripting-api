import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export as namespace WoT;

/**
 * The WoTFactory (usually instantiated as "WoT" object) is the main API entry point
 * and it is exposed by an implementation of the WoT Runtime.
 */
export interface WoTFactory {
    /**
     * Starts the discovery process that will provide ConsumedThing 
     * 
     * @param filter represents the constraints for discovering Things as key-value pairs
     */
    discover(filter?: ThingFilter): Observable<ConsumedThing>;

    /**
     * Accepts an url argument and returns a Promise of a ThingDescription
     * @param url URL of a thing description
     */
    fetch(url: string): Promise<ThingDescription>;

    /**
     * Accepts a ThingDescription and returns a ConsumedThing
     * @param url URL of a thing description
     */
    consume(td: ThingDescription): ConsumedThing;

    /**
     * Accepts a model argument of type ThingModel and returns an ExposedThing object
     * 
     * @param model can be either a ThingTemplate, or a ThingDescription. 
     */
    produce(model: ThingModel): ExposedThing;

    /**
     * Make a request to register td to the given WoT Thing Directory..
     */
    register(directory: string, thing: ExposedThing): Promise<void>;

    /**
     * Makes a request to unregister the thing from the given WoT Thing Directory. */
    unregister(directory: string, thing: ExposedThing): Promise<void>;
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
     * The fragment field represents a ThingFragment dictionary used for matching against discovered Things.
     */
    fragment?: ThingFragment;
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
 * WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
 * In this version of the API, Thing Descriptions are represented as opaque strings, denoting a serialized form, for instance JSON or JSON-LD
 */
export declare type ThingDescription = string;

/** Carries version information about the TD instance. If required, additional version information such as firmware and hardware version (term definitions outside of the TD namespace) can be extended here. */
export interface Versioning {
    instance?: string;
}

/**
 * The ThingFragment dictionary contains fields to initialize a Thing or to match during discovery
 */
export interface ThingFragment {
    /** A hint to gernerate the identifier for the Thing */
    id?: string;
    /** The name attribute represents the user given name of the Thing */
    name?: string;
    /** Define the base URI that is valid for all defined local interaction resources */
    base?: string;
    /** A human-readable description of the Thing */
    description?: string;
    /** Human-readable descriptions in different languages */
    descriptions?: MultiLanguage;
    /** Information about the Thing maintainer, e.g., author or contact URI */
    support?: string;
    /** Provides information when the TD instance was last modified */
    lastModified?: string;
    /** Provides information when the TD instance was created */
    created?: string;
    /** Provides version information */
    version?: Versioning;

    /** Set of named security configurations (definitions only). Not actually applied unless names are used in a security section */
    securityDefinitions?: { [key: string]: Security }
    /** Set of security definition names, chosen from those defined in securityDefinitions.  */
    security?: Array<String>;

    /** A map of PropertyFragments with decriptions only */
    properties?: { [key: string]: PropertyFragment }
    /** A map of ActionFragments with decriptions only */
    actions?: { [key: string]: ActionFragment }
    /** A map of EventFragments with decriptions only */
    events?: { [key: string]: EventFragment }
    /** A list of Web links to other Things or metadata */
    links?: Array<Link>;
    /** Indicates one or more endpoints at which operation(s) on this resource are accessible */
    forms?: Array<Form>;
    /**
     * A collection of predicate terms that reference values of any type,
     * e.g., @context, @type, or other terms from the vocabulary defined in @context.
     */
    [key: string]: any;
}

/** A Thing model is used for producing a new ExposedThing and can be either a ThingTemplate, or a ThingDescription.  */
export declare type ThingModel = (ThingDescription | ThingFragment);

/** Base for representing Thing Interaction descriptions */
export interface InteractionFragment {
    /** A human-readable title for the Interaction, e.g., for UIs */
    title?: string;
    /** Human-readable titles for the Interaction, in different languages */
    titles?: MultiLanguage;
    /** A human-readable description of the Interaction */
    description?: string;
    /** Human-readable descriptions in different languages */
    descriptions?: MultiLanguage;
    /** Set of authorization scope identifiers */
    scopes?: Array<string>;
    /** URI template variables */
    uriVariables?: DataSchema;
    /** Set of security definition names */
    security?: Array<string>;

    /**
     * A collection of predicate terms that reference values of any type,
     * e.g., @type, or other terms from the vocabulary defined in @context.
     */
    [key: string]: any;
}

/** Represents a Thing Property description */
export interface PropertyFragment extends InteractionFragment, BaseSchema {
    observable?: boolean;
}
/** Represents a Thing Action description */
export interface ActionFragment extends InteractionFragment {
    input?: DataSchema;
    output?: DataSchema;
    safe?: boolean;
    idempotent?: boolean;
}
/** Represents a Thing Event description */
export interface EventFragment extends InteractionFragment {
    subscription?: DataSchema;
    data?: DataSchema;
    cancellation?: DataSchema;
}

/**
 * A Thing instance must have an id and a name and its Interactions do have forms and
 * functions to interact (read/write/invoke/subscribe/emit).
 */
export interface ThingInstance extends ThingFragment {
    /** id becomes mandatory for Thing instances */
    id: string;
    /** name becomes mandatory for Thing instances */
    name: string;
    /** base becomes available for Thing instances (part of binding metadata) */
    base?: string;

    /** A map of ThingProperties (PropertyFragment plus mandatory binding metadata (forms)) */
    properties: { [key: string]: ThingProperty };
    /** A map of ThingActions (ActionFragment plus mandatory binding metadata (forms)) */
    actions: { [key: string]: ThingAction };
    /** A map of ThingEvents (EventFragment plus mandatory binding metadata (forms)) */
    events: { [key: string]: ThingEvent };
}

/**
 * The Interaction interface is an abstract class to represent Thing interactions: Properties, Actions and Events.
 */
export interface ThingInteraction extends InteractionFragment {
    forms: Array<Form>;
}

/** Represents an interactable Thing Property */
export interface ThingProperty extends ThingInteraction, PropertyFragment //, Observable<any>
{
    read(options?: any): Promise<any>;
    write(value: any, options?: any): Promise<void>;
    subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription;
}
/** Represents an interactable Thing Action */
export interface ThingAction extends ThingInteraction, ActionFragment {
    invoke(parameter?: any, options?: any): Promise<any>;
}

/** Represents an interactable Thing Event */
// FIXME: Events are different on ConsumendThing and ExposedThing
export interface ThingEvent extends ThingInteraction, EventFragment {
    subscribe(next?: (data: any) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    // FIXME emit should be only on ExposedThings' ThingEvents - therefore move emit() to ExposedThing?
    emit?(data?: any): void;
}

/** Represents a client API object to consume Things and their Properties, Actions, and Events */
export interface ConsumedThing extends ThingInstance {
    // no additional functions defined
}

/** Represents a server API object to expose Things and their Properties, Actions, and Events */
export interface ExposedThing extends ThingInstance {

    // define how to expose and run the Thing

    /**
     * Start serving external requests for the Thing, so that WoT Interactions using Properties, Actions and Events will be possible.
     */
    expose(): Promise<void>;

    /**
     * Stop serving external requests for the Thing and destroy the object. Note that eventual unregistering should be done before invoking this method.
     */
    destroy(): Promise<void>;

    // define Thing Description modifiers

    /**
     * Adds a Property with name defined by the name argument, the data schema provided by the property argument of type PropertyFragment, and optionally an initial value provided in the argument initValue whose type should match the one defined in the type property.
     */
    addProperty(name: string, property: PropertyFragment, init?: any): ExposedThing;

    /**
     * Removes the Property specified by the name argument and updates the Thing Description. Throws on error. Returns a reference to the same object for supporting chaining.
     */
    removeProperty(name: string): ExposedThing;

    /**
     * Adds to the actions property of a Thing object an Action with name defined by the name argument, defines input and output data format by the action argument of type ActionFragment, and adds the function provided in the handler argument as a handler, then updates the Thing Description.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    addAction(name: string, action: ActionFragment, handler: ActionHandler): ExposedThing;

    /**
     * Removes the Action specified by the name argument and updates the Thing Description.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    removeAction(name: string): ExposedThing;

    /**
     * Adds an event with name defined by the name argument and qualifiers and initialization value provided by the event argument of type EventFragmentto the Thing object and updates the Thing Description.
     * Throws on error.
     * Returns a reference to the same object for supporting chaining.
     */
    addEvent(name: string, event: EventFragment): ExposedThing;

    /**
     * Removes the event specified by the name argument and updates the Thing Description.
     * Returns a reference to the same object for supporting chaining.
     */
    removeEvent(name: string): ExposedThing;

    // define request handlers

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
}

// TODO: Decide if decorator (with 'internal') or replacement (without 'internal') for get()
// For now decorator in node-wot
export declare type PropertyReadHandler = (internal?: any, options?: any) => Promise<any>;

// TODO: Decide if decorator (return any) or replacement (return void) for set()
// For now decorator in node-wot
export declare type PropertyWriteHandler = (value: any, options?: any) => Promise<any>;

export declare type ActionHandler = (parameters: any, options?: any) => Promise<any>;

export interface Link {
    href: string;
    rel?: string | Array<string>;
    type?: string; // media type hint, no media type parameters
    anchor?: string;
}

export interface ExpectedResponse {
    contentType?: string;
}

export interface Form {
    href: string;
    subprotocol?: string;
    op?: string | Array<string>;
    contentType?: string; // media type + parameter(s), e.g., text/plain;charset=utf8
    security?: Array<string>; // Set of security definition names, chosen from those defined in securityDefinitions  // Security;
    scopes?: Array<string>;
    response?: ExpectedResponse;
}

export declare type MultiLanguage = any; // object?

export type DataSchema = BooleanSchema | IntegerSchema | NumberSchema | StringSchema | ObjectSchema | ArraySchema | NullSchema;

export interface BaseSchema {
    type?: string;
    title?: string;
    titles?: MultiLanguage;
    description?: string;
    descriptions?: MultiLanguage;
    writeOnly?: boolean;
    readOnly?: boolean;
    oneOf?: Array<DataSchema>;
    unit?: string;
    const?: any;
    enum?: Array<any>;
}

export interface BooleanSchema extends BaseSchema {
    type: "boolean";
}

export interface IntegerSchema extends BaseSchema {
    type: "integer";
    minimum?: number;
    maximum?: number;
}

export interface NumberSchema extends BaseSchema {
    type: "number";
    minimum?: number;
    maximum?: number;
}

export interface StringSchema extends BaseSchema {
    type: "string";
}

export interface ObjectSchema extends BaseSchema {
    type: "object";
    properties: { [key: string]: DataSchema };
    required?: Array<string>;
}

export interface ArraySchema extends BaseSchema {
    type: "array";
    items: DataSchema;
    minItems?: number;
    maxItems?: number;
}

export interface NullSchema extends BaseSchema {
    type: "null";
}

export type Security = NoSecurityScheme | BasicSecurityScheme | DigestSecurityScheme | BearerSecurityScheme | CertSecurityScheme | PoPSecurityScheme | APIKeySecurityScheme | OAuth2SecurityScheme | PSKSecurityScheme | PublicSecurityScheme;


export interface SecurityScheme {
    scheme: string;
    description?: string;
    proxy?: string;
}

export interface NoSecurityScheme extends SecurityScheme {
    scheme: "nosec";
}

export interface BasicSecurityScheme extends SecurityScheme {
    scheme: "basic";
    in?: string;
    name?: string;
}

export interface DigestSecurityScheme extends SecurityScheme {
    scheme: "digest";
    name?: string;
    in?: string;
    qop?: string;
}

export interface APIKeySecurityScheme extends SecurityScheme {
    scheme: "apikey";
    in?: string;
    name?: string;
}

export interface BearerSecurityScheme extends SecurityScheme {
    scheme: "bearer";
    in?: string;
    alg?: string;
    format?: string;
    name?: string;
    authorization?: string;
}

export interface CertSecurityScheme extends SecurityScheme {
    scheme: "cert";
    identity?: string;
}

export interface PSKSecurityScheme extends SecurityScheme {
    scheme: "psk";
    identity?: string;
}

export interface PublicSecurityScheme extends SecurityScheme {
    scheme: "public";
    identity?: string;
}

export interface PoPSecurityScheme extends SecurityScheme {
    scheme: "pop";
    format?: string;
    authorization?: string;
    alg?: string;
    name?: string;
    in?: string;
}

export interface OAuth2SecurityScheme extends SecurityScheme {
    scheme: "oauth2";
    authorization?: string;
    flow?: string; // one of implicit, password, client, or code
    token?: string;
    refresh?: string;
    scopes?: Array<string>;
}

