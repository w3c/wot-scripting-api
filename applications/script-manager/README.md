# WoT Script Manager Thing

The purpose of this document is to explain ManagerThing that can deal remote Thing lifecycle management by co-working with ScriptingAPI.

### 1. ManagerThing

ManagerThing is a capability in servient that provide management functionalities of servient and exposes management APIs to external clients.<br>

The managerThing takes advantage of [Thing Description(TD)](https://w3c.github.io/wot-thing-description/), [ScriptingAPI](https://w3c.github.io/wot-scripting-api/), and [wot security-privacy](https://github.com/w3c/wot/tree/master/security-privacy).

TD for ManagerThing declares fixed management commands as actions that a servient supports. <br>
A Client that supports Scripting API(ConsumedThing) obtains the TD and knows what management capabilities are available. Then the Client issue commands to control the servient remotely.<br>

### 2. Management commands
ManagerThing provides the following managemet commands.<br>

The following commands deals life cycle of script.
* install: install a script and return a handle (e.g. URI, UUID).<br>
* run: run a script by a handle.<br>
* stop: stop a running script by a handle.<br>
* uninstall: uninstall a script specified by a handle and discard the handle.<br>

The script may include Scripting API commands.<br>

### 3. Thing Description for ManagerThing

A sample TD for ManagerThing is as follows:

```rb
{
"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld",
			 { "manager": "http://w3c.github.io/wot/managerthing#" }
			],
  "@type": ["ManagerThing"],
  "name": "ManagerThing",
  "interaction": [
    {
      "@type": ["Action","manager:install"],
      "name": "install",
      "inputData":  { "type": "string" },
      "outputData":  { "type": "string" },
      "link": [{
        "href" : "coap://mytemp.example.com:5683/install",
        "mediaType": "application/json"
        }]
    },
    {
      "@type": ["Action","manager:run"],
      "name": "run",
      "inputData":  { "type": "string" },
      "link": [{
        "href" : "coap://mytemp.example.com:5683/run",
        "mediaType": "application/json"
        }]
    },
    {
      "@type": ["Action","manager:stop"],
      "name": "stop",
      "inputData":  { "type": "string" },
      "link": [{
        "href" : "coap://mytemp.example.com:5683/stop",
        "mediaType": "application/json"
        }]
    },
    {
      "@type": ["Action","manager:uninstall"],
      "name": "uninstall",
      "inputData":  { "type": "string" },
      "link": [{
        "href" : "coap://mytemp.example.com:5683/uninstall",
        "mediaType": "application/json"
        }]
    }
  ]
}
```

### 4. WebIDL

The ManagerThing can be described in WebIDL as follows.

```rb
typedef ScriptID USVString;  // e.g. UUID

interface ScriptManagerThing {
  // main actions
  any run(USVString script);  // run a serialized script and return the result or error
  ScriptID? install(USVString script, optional unsigned long bootSequence);  // save
  bool uninstall(ScriptID handle);  // uninstall a script by handle (stop, unmark, delete)
  bool stop(ScriptID handle);  // stop a running script by handle
};
```

### 5. Usage

#### 5.1 Preparation for remote management
Servient supports fixed management command that declared as TD for ManagerThing. The servient exposes API and is controlled by external client through the TD. Client has a program that issues WoT.discover() command to obtain the TD.<br>

<img src=./images/ManagerThing_Fig1.png width=600 alt="Fig.1">

The following diagram depicts how ManagerThing preapard to use.

<img src=./images/ManagerThing1.png width=600 alt="Fig.2">

- ManagerThing registers a TD for ManagerThing to a TD repository.
- ConsumedThing in an external client acquires the TD by WoT. discover command.
- ConsumedThing receives the TD and understands the what management capabilities are supported in the ManagerThing.

#### 5.2 Remote management of servient

The external client manages a servient remotely using Scripting API(ConsumedThing).<br>
- Servient has a ManagerThing and the ManagerThing is accessed from the client remotely.
- ManagerThing inherited the mechanism from ExposedThing and expose WoT API for ManagerThing.

<img src=./images/ManagerThing_Fig2.png width=600 alt="Fig.3">

The script of left hand side (Script#1) shows the part of ManagerThing program to manage servient and the APIs are exposed.<br>

The script of the middle (Script#2) shows a script from a Script repository.<br>
- For example, a script in Script repository may include e.g. Create a new exposed Thing from a Thing Description.

The script of right hand side (Script#3) shows a sript for ConsumedThing to manage the servient remotely.<br>
- For example, when client invoke "install" and "run" commands, servient gets script and save, then execute the script.

The following diagram depicts how ManagerThing works based on the usage of a script installation.
<img src=./images/ManagerThing2.png width=600 alt="Fig.4">

- Install:<br>
ConsumedThing in external client issues install command to ManagerThing by invokeAction.<br>
ManagerThing downloads a script from script repository and saves the script to file system in servient.<br>
- Run:<br>
ConsumedThing issues run command to ManagerThing by invokeAction.<br>
ManagerThing deploys the script to execution area in servient and run the script.<br>
- Stop:<br>
ConsumedThing issues stop command to ManagerThing by invokeAction.<br>
ManagerThing stop the execution of script in execution area.<br>
- Uninstall:<br>
ConsumedThing issues uninstall command to ManagerThing by invokeAction.<br>
ManagerThing uninstall and discard the script from execution area and servient.<br>

### 6. Security consideration
...
