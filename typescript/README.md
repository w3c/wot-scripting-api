# TypeScript definitions

TypeScript definition files can be used by implementations such as [Eclipse Thingweb](https://projects.eclipse.org/projects/iot.thingweb).

We currently provide the following TypeScript definition files:
* [WoT Scripting API](./scripting-api)
* [WoT Thing Description](./thing-description)
* [WoT Thing Model](./thing-model)

## Notes on NPM publishing

Run `npm publish --workspaces --tag latest` in `typescript` folder.

Note: to publish just a subfolder use `npm publish --workspaces --tag latest -w ./<subfolder>`

Requirement: npm version 7+
