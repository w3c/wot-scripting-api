# TypeScript definitions

TypeScript definition files can be used by implementations such as [Eclipse Thingweb](https://projects.eclipse.org/projects/iot.thingweb).

We currently provide two TypeScript definition files:
* [WoT Scripting API](./scripting-api)
* [WoT Thing Description](./thing-description)

## Notes on NPM publishing

Run `npm publish --workspaces` in `typescript` folder.

Note: to publish just a subfolder use `npm publish --workspaces -w ./<subfolder>`

Requirement: npm version 7+
