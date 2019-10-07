# WoT Scripting API - Release Notes

The changes compared to [previous version](https://www.w3.org/TR/2018/WD-wot-scripting-api-20181129/) are also enumerated in the
[Changes](https://w3c.github.io/wot-scripting-api/#Changes) section of the spec.

This version, introducing the following major changes:
- Remove fetch() for fetching a TD (delegated to external API).
- Remove Observer and use W3C TAG recommended design patterns.
- Align the discovery API to other similar APIs (such as W3C Generic Sensor API).
-Remove the large data definition API for constructing TDs and leverage using ThingDescription instead.
- Add missing algorithms and rework most existing ones.
- Allow constructors for ConsumedThing and ExposedThing.
- Add API rationale as an appendix to this document.

For a complete list of changes, see the [github change log](https://github.com/w3c/wot-scripting-api/commits/master).