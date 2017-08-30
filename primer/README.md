# Primer for Scripting API

This document attempts to explain how [W3C WoT(Web of Things) Scripting API](https://w3c.github.io/wot-scripting-api/index.html) works.

## How Scripting API works?

Scripting API is a building block to provide means for discovery, provisioning and control of thing that realizing [WoT Architecture](https://w3c.github.io/wot/architecture/wot-architecture.html). Scripting API consists of mainly two types of functions i.e. Expose Thing and Consumed Thing that are incorporated in WoT Server, WoT Client, or WoT Servient. The following sections attempt to explain how those work.

### 1\. ExposedThing in WoT Server

ExposedThing controls building block of WoT and manages life cycle of WoT Server API.

#### (A) Provisioning: Development and Setup

Given a script that has ExposedThing command tied with device access function, ExposedThing generate a [WoT Thing Description
(TD)](https://w3c.github.io/wot-thing-description/) and expose the server API.

<img src=./images/Fig1.png width=600 alt="Fig.1" >


The followings shows the sequence of this figure.
(1) In the development phase of WoT Server, Write a script uses ExposedThing with callback function that can accessing a thing.<br>
(2) In the setup phase, run the script and make each object.<br>
(3) When exposing WoTAPI, as an option, it would generate the TD and register to TD repository.<br>
(4) Invoking expose command, expose WoTAPI based on the object made by parsing the script.

#### (B) Runtime: Control of thing

At the runtime, when a WoTAPI is called,the callback is executed to control the Thing.

<img src=./images/Fig2.png width=600 alt="Fig.2" >

#### (C) Runtime provisioning: add thing

Given another script that has ExposedThing command tied with device access function, ExposedThing generate a TD and expose the server API.

<img src=./images/Fig3.png width=600 alt="Fig.3" >

#### (D) Runtime: unregister thing

A script that has an unregister thing can unregister the exposed thing, the callback function, and the TD.

<img src=./images/Fig4.png width=600 alt="Fig.4" >

#### (E) Expose thing with semantics

A script that comes with SemanticType generates a TD with semantic expression. It can be searched by accessing TD repository.

<img src=./images/Fig5.png width=600 alt="Fig.5" >

#### (F) Runtime provisioning: Set permission to WoTAPI

Generate a security token using e.g. IETF ACE and set permission to WoTAPI. Check the security token when WoTAPI is called.

<img src=./images/Fig17.png width=600 alt="Fig.17" >

### 1-1\. Using Expose Thing

ExposedThing can be used in any layers i.e. Client, Cloud/Server, Gateway/Edge, and Device.

<img src=./images/Fig6.png width=600 alt="Fig.6" >

ExposedThing in various layers and combinations.

<img src=./images/Fig7.png width=700 alt="Fig.7" >

### 2\. ConsumedThing in WoT Client

ConsumedThing controls building blocks of WoT and manages life cycle of WoT Client API.

#### (A) Runtime provisioning

Search a device initiates a discovery and set up a ConsumedThing API to use.

<img src=./images/Fig8.png width=600 alt="Fig.8" >

The followings shows the sequence of this figure.
(a) Search a device from an application using discovery API.<br>
(i) Discovery function accesses to the TD repository.<br>
(ii) Download the TD.<br>
(iii) ConsumedThing parses the TD.<br>
(iv) ConsumedThing exposes client API.<br>
(a') Application receive the search result.

#### (B) Runtime: Control of thing with abstracted manner

Application access the device with method call. ConsumedThing interprit the access as WoTAPI call.

<img src=./images/Fig9.png width=600 alt="Fig.9" >

#### (C) Runtime provisioning: search and use another thing

Search another device initiates a discovery and set up the Thing API to use. The sequence is the same with (a).

<img src=./images/Fig10.png width=600 alt="Fig.10" >

### 2-1\. Using Consumed Thing

ConsumedThing can be used in any layers.

<img src=./images/Fig11.png width=700 alt="Fig.11" >

ConsumedThing in various layers and combinations.

<img src=./images/Fig12.png width=600 alt="Fig.12" >

### 2-2\. Example: WoT Server and WoT Client
A use case that uses a WoT Server and a WoT Client is shown here i.e. An electronic appliance with WoT server is controlled by a remote controller with WoT client.

<img src=./images/Fig13.png width=700 alt="Fig.13" >

The followings shows the sequence of this Figure.
(1) Script has ExposedThing call with callback function that has access method to a LED lamp.<br>
(2) Run an script that has scripting API call.<br>
(3) ExposeThing generate a TD.<br>
(3') Register the TD to TD repository.<br>
(4) ExposeThing expose server API.<br>
(a) Application issues discovery command to search LED lamp.<br>
(i) ConsumedThing discover command to Discovery function.<br>
(ii) The discovery function queries TD repository to search LED lamp and receive the TD as the query result.<br>
(iii) ConsumedThing parses the TD.<br>
(iv) ConsumedThing expose client API.<br>
(a') Application receive result of the discovery.<br>
(b) Application for example issue a command for turn on the LED lamp. ConsumedThing interprit the command to WoTAPI command then access WoT server that manage the LED lamp. ExposedThing in the WoT server call callback function to turn on the LED lamp.

### 3\. ConsumedThing and ExposedThing in WoT Servient

WoT servient consists of three part i.e. Server, Client, and Legacy communication. It deals ConsumedThing and ExposedThing methods described above. Application layer may have multiple scripts.

### 3-1\. Provisioning / Control of thing

The followings shows the sequence of how WoT servient works for the provisioning and control of thing.

(1) A script that has ExposedThing call with callback to control a LED lamp.<br>
(2) The script generates ExposedThing object.<br>
(3) ExposedThing generates a TD.<br>
(3') Register the TD to TD repository.<br>
(4) ExposedThing expose server API.<br>
(i) An application issues discover command to discovery function.<br>
(ii) The discovery function queries TD repository or uses local discovery to search LED lamp and receive the TD.<br>
(iii) ConsumedThing parses the TD.<br>
(iv) ConsumedThing expose Client API.<br>
(b) WoTAPI of Server receives a command for turn on. Then callback function registerd to ExposedThing is called. If the LED lamp is connected to Client, Protocol Binding interprit the command in the callback to appropriate WoTAPI command. If the LED lamp is connected to Legacy Communication, the callback function issues the legacy communication command to control the LED lamp.

<img src=./images/Fig14.png width=700 alt="Fig.14" >

### 3-2\. Event handling

The followings shows the sequence of how WoT servient works for the events handling.
(c) A WoT Servient that is connected to another WoT Servient , WoT Server, or a Legacy device receive an event from them.
(d) A callback function described in script handles the event. For example:
- (e) Access to underneath device: Issue action or property call described in TD#1 to the underneath device through ClientAPI.
- (f) Proxy event: Transfer and issue same event to ExposedThing/WoTAPI. TD#1 and TD#2 have same definitions about the event.
- (g) Generate another event: Transform the event and issue as another event through ExposedThing/WoTAPI. TD#1 has definition of the event defined by the device and TD#2 has definition of new event that is transformed from the original event.
- (h) Make linked data: Save the event/events and allow to access by a property call through WoTAPI. TD#2 has a property definition that returns the event/events data based on an URI call.

<img src=./images/Fig18.png width=700 alt="Fig.18" >

### 3-3\. Example: Voting
A use case that uses WoT Servients and a WoT Client is shown here. WoT servient #3 maybe on the cloud provide devices shadow and consolidate devices and expose a service. A script for Thing to Thing (T2T) service provides two functions:
- Using heat sensor, automatically turn on air conditioner if getting cold.
- Turn on/off air conditioner by voting "feel cold" or "feel hot" from WoT clients. Based on the consensus, T2T script issue on/off command of the air conditioner.

Four types of scripts are placed in the application layers:
- control script for a heat sensor to WoT Servient #1
- control script for an air conditioner to WoT Servient #2
- Thing to thing service to WoT Servient #3
- Voting script to WoT Client

<img src=./images/Fig15.png width=700 alt="Fig.15" >

The followings shows the sequence of the fugure.

(1)

- Develop a control script for a heat sensor that have callback function and upload to application layer in WoT Servient #1.
- Develop a control script for an air conditioner that have callback function and upload to application layer in WoT Servient #2.
- Develop a T2T service script that has ExposedThing command and calling method of things to application layer in WoT Servient #3.
- Develop a Voting script that uses ConsumedThing command tha t is accesing to calling method of Thing to thing (T2T) service then download to WoT Client.<br>

(a)

- A heat sensor script tries to discover heat sensor through discovery mechanism.
- An air conditioner script tries to discover air conditioner through discovery mechanism.
- A T2T service script tries to discover the heat sensor and the air conditioner through discovery mechanism that is query TD repository.

(a') T2T service discovers things and gets TDs from TD repository.<br>

(iii)

- ConsumedThing of WoT Servient #3 and WoT Client parse the TD .

(iv)

- ConsumedThing of WoT Servient #1 expose a client API for receiving periodical data from heat sensor.
- ConsumedThing of WoT Servient #2 expose a client API for controlling an air conditioner.
- ConsumedThing of WoT Servient #3 expose client APIs for receiving data from WoT Servient #1 and controlling an air conditioner to WoT Servient #2.
- ConsumedThing of WoT Client expose a client API for voting.

(2)

- Control script for heat sensor registers a callback for event to ExposedThing. The callback calls the Client API that receive the data of heat sensor.
- Control script for air conditioner registers a callback for action to ExposedThing. The callback calls the Client API that controls air conditioner.
- T2T service script for voting registers a callback for action to ExposedThing. The callback calls the Client API that controls air conditioner of WoT Servient #2.

(3)

- ExposeThing of WoT Servient #1 generates a TD for receiving the sensor data.
- ExposeThing of WoT Servient #2 generates a TD for controllig air conditioner.
- ExposeThing of WoT Servient #3 generates a TD for voting.

(3') ExposedThings register the TDs to TD repository.<br>
(4) ExposedThing expose the server APIs.<br>

At the runtime (b):<br>
Control route 1: T2T control

- Heat sensor periodically generate heat values.
- WoT Servient #1 receives the raw data and issues a callback in the object of ConsumedThing. Then the control script for heat sensor issues an event to T2T service in WoT Servient #3 that subscribe the event.
- T2T service script check the value whether it surpass the threshold, if so, it calls turn on/off the air conditioner by issueing a WoTAPI command to WoT Servient #2\. When receiving the command, callback function in ExposedThing is called and control the air conditioner.

Control route 2: Voting

- Users can vote to express their preference by issueing too hot or too cold from a voting application that calls the object of ConsumedThing and ConsumedThing issues a voting command. The voting script issues a message to T2T service script. T2T service script counts the voting and if it surpass the threshold, issue command to control air conditioner by accessing Client API.
- The object of ExposedThing receives voting from WoT API that connected to clients, the T2T service receives, counts voting, and if the count surpass the threshold, the T2T service calls callback function.
- T2T service calls the control script for airconditioner, the control script issues command via the object of ConsumedThing to the air conditioner.

### 3-4\. Example: Layered structure

WoT can provide layerd structure and following is an example.
WoT Server are used in devices.
WoT Servient are used in gateways / edges and on the Cloud service.
WoT Client are used in clients.

<img src=./images/Fig16.png width=700 alt="Fig.16" >
