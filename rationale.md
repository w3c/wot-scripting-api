# Rationale for Scripting API design

This document attempts to explain why various decision for [W3C WoT(Web of Things) Scripting API](https://w3c.github.io/wot-scripting-api/index.html) were made the way they were.

## Using factories vs constructors
As discussed in [issue 3](https://github.com/w3c/wot-scripting-api/issues/3), and as suggested [here](https://github.com/w3c/wot-scripting-api/issues/3#issuecomment-283746764), the guidelines are these:

> The root WoT object should not be constructible. It represents the UA's magic ability to discover things, similar to how the Navigator object represents the UA's magic ability to do a bunch of stuff. A namespace might be a good replacement here, if it truly has no state.

> Avoid constructor overloads. A true constructor should be something that directly copies the given essential data into internal fields. If there is a way to infer the essential data from some other data, then that should be a factory. So maybe ThingDescription is the essential data, and if we can infer that from a name or URL, then factory should be used (perhaps static factory, e.g. ExposedThing.fromName()).

> The idea of using a builder pattern (first create an X, then call X.expose() on it to turn into another object, or X-with-UA-magic) is rather unidiomatic in JavaScript. The better way to represent something without UA magic is just a dictionary. Having the same class represent two very distinct things is not great.


Resolutions:
- The browser implementations of the WoT Scripting API uses a namespace object `wot` in the browser.
- Non-browser implementations that use various runtimes may use either a namespace object `wot`, or an API object provided by the `require()` or `import()` or similar mechanisms.
- The `ConsumedThing` and `ExposedThing` objects are created by factory methods.

## Discovery API

Based on [WoT Current Practices](https://w3c.github.io/wot/current-practices/wot-practices.html#td-discovery), there are different discovery types: local (to the hardware), proximity based (such as BLE or NFC), registry (directory) based, and broadcast/multicast based. The discovery type is specific to the underlying protocol bindings.

The discovery results may be filtered either at the source or at reception, by constraints made on the Thing Description.

Based on [issue 16](https://github.com/w3c/wot-scripting-api/issues/16) there is a need to be able to tell the WoT Runtime to stop discovery (or in the case of open ended requests, suppress further discovery results). Therefore returning `Promise` was not an option any more, since cancellable `Promise`s were [dropped](https://github.com/tc39/proposal-cancelable-promises).

Resolutions:
- Use [Observables](https://github.com/tc39/proposal-observable) for controlling the discovery process (subscribe, unsubscribe).
- Use a single filter definition that also contains a property for discovery type, defaulting to `"any"`. It is simpler and more intuitive to use than having a separate parameter for discovery type. Some of the discovery types, such as registry/directory based discovery also require another parameter for the address of the directory. This can be provided as a required property in the discovery filter, described in the discovery algorithm.

## Server API (`ExposedThing`)
Scripts that define Exposed Things should ensure the following:
1. define properties, actions and events according to the Thing Description.
2. define request handler functions to implement the serving end for the Client API.

## Client API (`ConsumedThing`)
Scripts that use the Client API are basically sending requests to servers in order to retrieve or update properties, invoke actions, and observe properties, actions and events. When the `ConsumedThing` is fetched, its Thing Description is also fetched, then client scripts can track changes by subscribing to events that signal TD changes.

For browser compatibility of the Client API, events are used with the DOM convention: an Event (or Event sub-class) object is passed as an argument to the event listener, which contains a property with the event payload data, instead the Node.js convention where payload is directly passed to the event listener as arguments.

There is no Client API for creating Things. ExposedThings can be created only locally through the Server API. However, a WoT Runtime may have a special management Thing exposed that would accept actions for installing, uninstalling, running and stopping scripts in that WoT Runtime. These scripts may create local ExposedThings, so the use case of remote Thing creation can be implemented.
