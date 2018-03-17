# SolarEngine
Lighting Control Engine

This Nodejs application is designed to send lighting control data to clients. 

There are 3 main components to this application. 

- Engine Core
	- Responsible for calculating control data from asset for the client to use.
	- Caches last updated value for an asset.	

- Client Communications
	- Websocket server to communicate with clients.
	- Tracks clients sockets and configuration info.

- Controller Communications
	- Websocket client to communicate with the show controller.
