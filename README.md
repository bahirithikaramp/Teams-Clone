# *Welcome to the Teams Clone!*

Hi! In this project I have built a **Teams Clone**. The main frameworks that I have used for making the clone are, **NodeJS**, **ExpressJS**, **socket.io**, **PeerJS** and **WebRTC**. In the following readme file I have documented the features in the app, tech stacks used and the workflow of the project.


# ABOUT THE APP

The teams clone I have designed offers security, chat application independent of the meeting, responsive UI, external chat room for entertainment and  **many** other features!

## The clone has the following features :
- User authentication (register, login, logout).

- Create a peer to peer connection.

- Lets the user stream their audio and video/ disable them.

- Lets the user create messages and send them in the chat window.

- Lets the user share screen.

- Lets user use the whiteboard provided.

- Chat room independent of the meeting.


## The frameworks used for building the clone are :
- PassportJS - for user authentication.

- Bcrypt - for creating a hashed password and making the app secure.

 - Ejs (embedded JavaScript) - for ease of communication between the frontend and the server.

- ExpressJS, NodeJS, socket.io, WebRTC - for creating the web application and letting the user communicate.

- Express flash - for flashing a message without redirecting to the request.

- Express session - when implemented, every user of our API or website will be assigned a unique session, and this allows you to store the user state.

- PeerJS - for creating a peer to peer connection.

- uuid - for creating a new room id.

- dotenv - for using the environment variables in the process.

## Plan of action :
- Initialise our NodeJS project.

- Initialise our first view (what we will see on frontend).

- Create a room id.

- Add the ability to view our own video.

- Add ability for others to stream their video.

- Add styling.

- Add the ability to create messages.

- Add mute button.

- Add stop video button.

- Adding whiteboard and leave meeting button.

- Adding share screen option.

- Adding user authentication.

- Removing screen freeze when user leaves meeting.

- Adding multi user chat room independent of the meeting for entertainment.

- Making the inbuilt chat application independent of the meeting (ADPOT).


# SECURITY

Security is one of the key features for any application to stay protected. In my application I have initialised user authentication, wherein the user has to register first and then login to go to meeting and have. conversation with their peers.
To ensure proper protection of the password I have used **Bcrypt** and hashed the password **ten** times, to ensure **good protection** as well as **make it fast**.

- The security feature will ensure that only registered participants can enter the meeting..
	> Bcrypt - password-hashing function based on Blowfish cipher

# DEPLOYMENT

I have deployed the application on **Heroku**. I have deployed the application using pipelines, thus whenever any new changes are committed to the file all the changes are reflected in the Heroku application as well. Below I am attaching a link to my app :

[Click here to go to the deployed app](https://pacific-hamlet-30189.herokuapp.com/d0fa2eba-ab6d-416e-854b-b07c9afd2006)

# CHAT ROOM

In my app I have also linked an external multi user chat room which can be anonymously used by the participants and provides space for the users to engage in light conversations out of the meeting.
For the chat room I created an Express application and deployed it on Heroku and integrated it in my application. 

> Sometimes a break from your routine is all you need!

[Link to Github repo](https://github.com/bahirithikaramp/ChatCord.git)  
[Link to deployed chat room](https://fathomless-chamber-19683.herokuapp.com/)

