<p align="center">
  <a href="https://w3.org/wot">
    <img alt="Web of Things Homepage" src="https://www.w3.org/WoT/IG/wiki/images/8/8f/WOT-hz.svg" width="300" />
  </a>
</p>

<p align="center">
  <a href="https://w3c.social/@wot">
    <img alt="Follow on Mastodon" src="https://img.shields.io/mastodon/follow/111609289932468076?domain=https%3A%2F%2Fw3c.social"></a>
  <a href="https://twitter.com/W3C_WoT">
    <img alt="X (formerly Twitter) Follow" src="https://img.shields.io/twitter/follow/W3C_WoT"></a>
  <a href="https://stackoverflow.com/questions/tagged/web-of-things">
    <img alt="Stack Exchange questions" src="https://img.shields.io/stackexchange/stackoverflow/t/web-of-things?style=plastic"></a>
</p>

<p align="center">
  <a href="https://www.w3.org/TR/wot-scripting-api/"> <!--  NOTE LINK -->
    <img alt="Latest Note" src="https://img.shields.io/badge/W3C_Note-Latest-005a9c"></a>
  <a href="https://w3c.github.io/wot-scripting-api/"> <!--  ED LINK -->
    <img alt="Latest Editor's Draft" src="https://img.shields.io/badge/Editor's_Draft-Latest-fe914a"></a>
</p>

# Web of Things (WoT) Scripting API

General information about the Web of Things can be found on https://www.w3.org/WoT/.
  
---

The main deliverable being developed in this repository is the [WoT Scripting API Specification](http://w3c.github.io/wot-scripting-api/).

Releases for [published versions](https://www.w3.org/TR/wot-scripting-api/) are found in [releases](./releases/).

See the [rationale.md](./rationale.md) for explanation on API design choices.

To make contributions, please refer to [https://github.com/w3c/wotwg#contributing](https://github.com/w3c/wotwg#contributing).

If you want to make a full text review on the spec or other files, follow the steps outlined [here](https://github.com/w3c/wot-scripting-api/pull/248).

## Logistics

- Call information: We use the W3C Calendar. You can find the next Scripting API call at https://www.w3.org/groups/wg/wot/calendar.
- Wiki (contains agenda): https://www.w3.org/WoT/IG/wiki/WG_WoT_Scripting_API_WebConf
- [Contribution rules](./CONTRIBUTING.md)

## Publications

- [Latest Editor's Draft](https://w3c.github.io/wot-scripting-api/)
- [Latest Group Note](https://www.w3.org/TR/wot-scripting-api/)

---

## TypeScript Definitions

The specification uses WebIDL definitions, but [TypeScript definitions](./typescript) are also available.
We use [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript) to generate the TypeScript definitions for [wot-thing-description-types](https://github.com/w3c/wot-scripting-api/tree/main/typescript/thing-description) and [wot-thing-models-types](https://github.com/w3c/wot-scripting-api/tree/main/typescript/thing-model).

## Technical Matrix

We use [labels](https://github.com/w3c/wot-scripting-api/labels) to categorize our work items.

## Versioning 
As discussed in the [27th February 2023](https://www.w3.org/2023/02/27-wot-script-minutes.html#t06) call, the task force decided to use a new versioning mechanism for the WoT Scripting API specification. In practice, we augment the current Typescript versioning with a more comprehensive tagging mechanism that takes into account also standard W3C process for publishing Notes. Each substantial change will trigger the creation of a git tag on the repository and when the Note is published it will trigger a full Github release. Substantial changes are anything that is not just an editorial or rephrasing of the current document content; examples of substantial changes are:
- Fixing an algorithm
- New function or change in the argument list of an existing function
- Introducing a new type
- Fixing WebIDL
- etc.

On the other hand, examples of non-substantial changes are:
- Typos in the document
- Introduce new examples or explanatory text
- Improve readability or document structure

In every circumstance, different substantial changes may be packed together in one single git tag if they are closely related or are merged in a short period (e.g. a day). Tags follow [semantic versioning](https://semver.org/)
```
major.minor.patch-[alpha].[id]
```
- `id` identifies the experimental revision of an ongoing `majory.minor.patch` version. 

Here is an example of the process we will use:
 * We publish the current document and tag it with 0.8.0
 * Then we make some relevant changes (e.g. a bug fix)
 * We tag version 0.8.1-alpha.1
 * We continue fixing stuff
 * Then we go for 0.8.1-alpha.2
 * If we change the API (adding a new function) we should go for 0.9.0-alpha.1
 * We can cycle in these changes as much as we want (e.g. 0.x.y-alpha.x)
 * When we want to publish the document again we remove the alpha (e.g. assuming we were at 0.9.1-alpha.10 we release 0.9.1)

Since we are still in a exploratory phase, we will use the `major` number `0` until we reach a certain level of maturity.

## Editors Tools

* [Search Cross References for ReSpec](https://respec.org/xref/)
