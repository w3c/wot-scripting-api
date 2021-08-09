# wot-typescript-definitions

A TypeScript definition file for the WoT Scripting API to be used by implementations such as [Eclipse Thingweb](https://projects.eclipse.org/projects/iot.thingweb).

## Notes on usage

These definitions are imported using npm.
Once we reach conclusion on the API in the W3C Web of Things Working Group, it is planned to add them to DefinitelyTyped.

## ES5 targets

As consumers are using TypeScript we target ES6.
When implementing for ES5 targets, be sure to provide a polyfill for ES6 Promises, either ``es6-promise`` from npm or add the lib ``es2015.promise`` to your tsc command when transpiling TypeScript.
