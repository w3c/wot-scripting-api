# Web of Things (WoT) Scripting API
[![Follow on Twitter](https://img.shields.io/twitter/follow/W3C_WoT.svg?label=follow+W3C_WoT)](https://twitter.com/W3C_WoT)
[![Stack Exchange questions](https://img.shields.io/stackexchange/stackoverflow/t/web-of-things?style=plastic)]( https://stackoverflow.com/questions/tagged/web-of-things)

General information about the Web of Things can be found on https://www.w3.org/WoT/.
  
---

The main deliverable being developed in this repository is the [WoT Scripting API Specification](http://w3c.github.io/wot-scripting-api/).

Releases for [published versions](https://www.w3.org/TR/wot-scripting-api/) are found in [releases](./releases/).

See the [rationale.md](./rationale.md) for explanation on API design choices.

To make contributions, please refer to [https://github.com/w3c/wotwg#contributing](https://github.com/w3c/wotwg#contributing).

If you want to make a full text review on the spec or other files, follow the steps outlined [here](https://github.com/w3c/wot-scripting-api/pull/248).

## TypeScript Definitions

The specification uses WebIDL definitions, but [TypeScript definititions](./typescript) are also available.

## Task Force Meeting Logistics

See https://www.w3.org/WoT/IG/wiki/WG_WoT_Scripting_API_WebConf. 

## Technical Matrix

We use [labels](https://github.com/w3c/wot-scripting-api/labels) to categorize our work items.

## Versioning 
As discussed in the [27th February 2023](https://www.w3.org/2023/02/27-wot-script-minutes.html#t06) call, the task force decided to use a new versioning mechanism for the WoT Scripting API specification. In practice, we augment the current Typescript versioning with a more comprehensive tagging mechanism that takes into account also standard W3C process for publishing Notes. Each substantial change will trigger the creation of a git on the repository and when the Note is published it will trigger a full Github release with a special tag. Substantial changes are anything that is not just an editorial or rephrasing of the current document content; examples of substantial changes are:
- Fix in an algorithm
- New function or change in the argument list of an existing function
- Introducing a new type
- Fix in WebIDL
- etc.

On the other hand, examples of non-substantial changes are:
- Typos in the document
- Introduce new examples or explanatory text
- Improve readability or document structure

In every circumstance, different substantial changes may be packed together in one single git tag if they are closely related or are merged in a short period (e.g. a day). Tags follow semantic versioning
```
majory.minor.patch-[Experimental | Release].[id]
```
- `id` identifies the experimental revision of an ongoing `majory.minor.patch` version. 


## Editors Tools

* [Search Cross References for ReSpec](https://respec.org/xref/)
