# Rationale for Scripting API design

This document attempts to explain why various decision for [W3C WoT(Web of Things) Scripting API](https://w3c.github.io/wot-scripting-api/index.html) were made the way they were.

## 1\. Why Constructor is used instead of Factory?

It would be simpler to expose the WoT object with a constructor. Also, for ExposedThing and ConsumedThing we could provide constructors instead of factories. That would be more aligned with ECMAScript best practices (e.g. an ExposedThing object could be created for testing purposes, shaped locally, then exposed).
