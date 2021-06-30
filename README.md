In this project I am making a Microsoft Teams clone. I am deploying the created web app to Heroku.  
  
The clone has the following features:  
  
    1. User authentication (register, login, logout).  
    2. Create a peer to peer connection.  
    3. Let's the user stream their audio and video/ disable them.  
    4. Let's the user create messages and send them in the chat window.  
    5. Let's the user share screen.  
    6. Let's user use the whiteboard provided.  
  
  
The frameworks used for building the clone are:  
  
    1. PassportJS - for user authentication.  
    2. Bcrypt - for creating a hashed password and making the app secure.  
    3. Ejs (embedded JavaScript) - for ease of communication between the frontend and the server
    4. ExpressJS, NodeJS, socket.io, WebRTC - for creating the web application and letting the user communicate.  
    5. Express flash - for flashing a message without redirecting to the request.  
    6. Express session - when implemented, every user of our API or website will be assigned a unique session, and this allows you to store the user state.  
    7. PeerJS - for creating a peer to peer connection.  
    8. uuid - for creating a new room id.  
    9. dotenv - for using the environment variables in the process.
  
  
Plan of action:  
  
    1. Initialise our NodeJS project.  
    2. Initialise our first view (what we will see on frontend).  
    3. Create a room id.  
    4. Add the  ability to view our own video.  
    5. Add ability for others to stream their video.  
    6. Add styling.  
    7. Add the ability to create messages.  
    8. Add mute button.  
    9. Add stop video button.  
    10. Adding whiteboard and leave meeting button.  
    11. Adding share screen option.  
    12. Adding user authentication.  
    13. Removing screen freeze when user leaves meeting.
  
  
