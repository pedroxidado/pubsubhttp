# PUB SUB CHALLENGE

The code in this repository helps solve challenge described in here https://pangaea-interviews.now.sh/be in which we had to do a pub sub using HTTP protocol. In this README file I will include the assumptions I made, trade-offs and justification of the technologies used.


-----
# Technologies

As the description of the problem mentioned endpoints, curl calls and HTTP protocol, I decided that this challenge should be solved using REST apis.

I decided to create the APIs using nodejs + express because it is minimalistic, It could help solve the purpose of building a simple API with not so many configuration that maybe other frameworks could bring. I considered creating the APIs using AWS API gateway, but I already had other personal projects over there and I'm barely within the free-tier limit.
Also, I have never built an API using nodejs + express and so far, it has been really fun!

As the challenge also mentioned that the API should store the URLs that are subscribed to a topic, I knew that I had to store that information somewhere. I considered using local storage (maybe using data structures or file system) but I decided to use mongodb because:
  - I wanted to explore more the tool with nodejs + express
  - I needed storage that doesnt require transaction level security, so relational database could be not really suited for this
  - I needed fast lookup, which no-sql offers
  
I also decided to mount everything within containers, mostly because I felt like this was a really good opporunity to play with the tool and also cause I needed my API to be connected to a local mongodb server, so using containers could help a lot with testing from other computers.

Also, because I needed to test if the event were published I decided to create a "copy" of the API within a Docker container so I could make request to that API. This container its called Client.

The container that has the "main API" with the pubsub logic its called Server.

-----
# Assumptions and Trade-offs

I really had a hard time deciding on the right architecture for this challenge. The key thing that kept me thinking on how to do it was the testing part. How could I test that the events could be subscribed.

I did built a version of this API using websockets, in which it uses HTTP protocol for the communication but once the communication is over, it remains with TCP communication. So it is always listening for new requests. 
For some time it felt that using websocket was the right way to do it but I decided not to include this to the APIs because:
  - The challenge example made CURL requests in order to test the API without setting websocket configuration
  - You can't test websockets using postman, you need a different client for that
  
Which is why I decided to build this using only Rest apis.

Also, I feel like my solution my not be the most efficient in terms of handling million of publish events. We could have these 2 scenarios:
  - Either thousands or millions of events to be published
  - A topic that is going to be published that has thousands or millions of URL subscribed to it

My API try to process all of them and then return a response, so any other incoming requests could be left hanging waiting for read access to the DB. I think that many things could go wrong.
I think that most of this concurrency problem could be solved using queues or state machines, but I felt that for purposes of this challenge, I assumed that corner case scenarios wont happen.

Another challenge that I wanted to attack was that I wanted to enforce security between the published event and the client. This is because I wanted the client to be sure that the event that they are getting is trully from the server and it's not another external agent that wants to get into the client system.
I did little research on that but I didnt have enough time for this. So i decided to include a query param called `source` in which if the value is `mypubsub` then it was sent for the server. 
This security level is really weak but it helped for the purposes of testing for this challenge.
-------
# Justification and Architecture

![Diagrama en blanco (1)](https://user-images.githubusercontent.com/55520489/79917309-de67fa00-83ef-11ea-8149-5dc27e906740.jpeg)

I implemented a router that will redirect to a Controller for a given action. I created two separate controllers. One for publishing logic and the other for subscription logic.
The `publish` directory will interact with the model for the subscription in order to get all the subscriptions that the endpoint needs to send an Event. 

The model for `publish` is based on Events. An event is basically a log level on wether the event was sent successfully to the subscribed URLs. 
The output doesnt contain all this information as this is more an information that the server must know.

-------
# Folder structure

API
  - Event
    - eventController.js --> main controller that helps for testing purposes
      - routes
        - eventRoutes.js --> defines the allowed methods and if valid routes to a controller
        - Validators
          - eventSchema.j --> validates the incoming request. Checks of the source in the query params and the body with a message
  - Publish
    - pubController.js --> main publish controller
      - models
        - event.js   --> defines DB schema for Events
      - routes
        - pubRoutes.js  --> defines allowed methods for Publish endpoint
          - validators
            - pubSchemas.js  --> validates the incoming request for Publish endpoints.
- Subscribe
    - subController.js --> main subscribe controller
      - models
        - subscriber.js --> defines DB schema for subscription
      - routes
        - subRoutes.js  --> defines allowed methods for Subscription endpoint
          - validators
            - subSchemas.js --> validates the incoming request for Subscribe endpoints
            
*Few key points I would like to mention:* I wanted to include unit and integration testing on the APIs but I didnt had enough time to do so. Even though the challenge didnt mention any of that, I feel like that is a really good practice. Also, having 100% code coverage is a really good practice for testing your code. But also, cause I didnt know how I was going to test if the pubsub was working correctly, my priority was to have that solved instead of unit testing.


--------------
# Installation

Clone the project
On the root of the project run `docker-compose up`

That will create 3 containers:
  1. Mongo
  2. Server: listening to port 3000, this will be used as the main api for the pubsub
  3. Client: listening to port 3001, this will be used for testing purposes
  
Once docker-compose is up, the allowed enpoints are
  - POST localhost:3000/subscribe/{topic}
  - POST localhost:3000/publish/{topic}

For testing purposes, when subscribing to a topic, we should use the following body:
```
{
	"url": "http://client:3001/event"
}
```

To publish a topic we could use the same body that is especified in the instructions

When testing, in the console we can see the following that indicates that it was successfull. The `server` lines indicates the logs from the server api. The `client` lines indicates that the client has received the event successfully:

![Captura de pantalla 2020-04-21 a la(s) 17 13 14](https://user-images.githubusercontent.com/55520489/79919188-80d5ac80-83f3-11ea-9cbf-cde5cb1126dd.png)

