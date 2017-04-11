# Rationale for Scripting API design

This document attempts to explain why various decision for [W3C WoT(Web of Things) Scripting API](https://w3c.github.io/wot-scripting-api/index.html) were made the way they were.

## Using factories vs constructors
As discussed in [issue 3](https://github.com/w3c/wot-scripting-api/issues/3), and as suggested [here](https://github.com/w3c/wot-scripting-api/issues/3#issuecomment-283746764), the guidelines are these:

> The root WoT object should not be constructible. It represents the UA's magic ability to discover things, similar to how the Navigator object represents the UA's magic ability to do a bunch of stuff. A namespace might be a good replacement here, if it truly has no state.

> Avoid constructor overloads. A true constructor should be something that directly copies the given essential data into internal fields. If there is a way to infer the essential data from some other data, then that should be a factory. So maybe ThingDescription is the essential data, and if we can infer that from a name or URL, then factory should be used (perhaps static factory, e.g. ExposedThing.fromName()).

> The idea of using a builder pattern (first create an X, then call X.expose() on it to turn into another object, or X-with-UA-magic) is rather unidiomatic in JavaScript. The better way to represent something without UA magic is just a dictionary. Having the same class represent two very distinct things is not great.


Resolutions:
- The WoT API uses a namespace object `wot` in the browser, or provided by `require()` in standalone runtimes.
- The `ConsumedThing` and `ExposedThing` objects are created by factory methods.

## Discovery API

Based on [WoT Current Practices](https://w3c.github.io/wot/current-practices/wot-practices.html#td-discovery), there are different discovery types: local (to the hardware), proximity based (such as BLE or NFC), registry (directory) based, and broadcast/multicast based. The discovery type is specific to the underlying protocol bindings.

The discovery results may be filtered either at the source or at reception, by constraints made on the Thing Description.

Based on [issue 16](https://github.com/w3c/wot-scripting-api/issues/16) there is a need to be able to tell the WoT Runtime to stop discovery (or in the case of open ended requests, suppress further discovery results). Therefore returning `Promise` was not an option any more, since cancellable `Promise`s were [dropped](https://github.com/tc39/proposal-cancelable-promises).

Resolutions:
- Use [Observables](https://github.com/tc39/proposal-observable) for controlling the discovery process (subscribe, unsubscribe).
- Use a single filter definition that also contains a property for discovery type, defaulting to `"any"`. It is simpler and more intuitive to use than having a separate parameter for discovery type. Some of the discovery types, such as registry/directory based discovery also require another parameter for the address of the directory. This can be provided as a required property in the discovery filter, described in the discovery algorithm.

## WoT Runtime, Applications, Scripts, Things

Based on the discussion in [issue 2](https://github.com/w3c/wot-scripting-api/issues/2), there is a use case for deploying WoT functionality to WoT Runtimes. This functionality is called an Application, and has an associated security identity and access rights.

An Application may be defined as a script, or a set of scripts, eventually with added configuration data and manifest data.

Alternatively, an Application may also be represented by a set of Things that are created and deployed in a WoT Runtime. The functionality is characterized by the Thing Descriptions of the participating Things. With this assumption, there is no new concepts needed for fulfilling the deployment use case. The WoT Scripting API just needs to provide methods for creating a Thing on a remote WoT Runtime, and modify existing Things on a remote Runtime.

The draft algorithm for creating a remote Thing is the following:
1. A script running in the initiating (controlling) WoT Runtime (WR) invokes the `wot.create()` API with the destination specified as the target (controlled) WoT Runtime. The method specifies the Thing Description and optionally also security related metadata (e.g. policy on further modification accesses). The implementation (bindings) of the participating WRs has been provisioned with identity, authentication mechanism, and access management functionality.
2. The target WR authenticates the initiating WR and checks for access rights, using either a local or a network based policy. If there are not sufficient rights for the request, reject the request with a security error.
3. If access rights are granted, the target WR creates the required Thing (involving full lifecycle integration, such as event loop, secure storage etc) and records the security metadata of the transaction (e.g. creator identity, group/security level, access policy etc). If creating fails, the transaction is rolled back and the request is rejected with an error.
4. If creating succeeds, the initiating WR generates an `ExposedThing` object for controlling the newly created Thing. Further modification requests are separately authenticated or a session may be maintained, depending on the capabilities of the underlying protocols.




