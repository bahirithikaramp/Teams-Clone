/* JS for the frontend */

/* Declaring all the variables used */
const socket = io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

/* Array to store the users */
const peers = {}

/* Creating a peer connection with port 443 (for hosting on heroku) */
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
}); 


/* promise to access the audio and video */
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

    let text = $('input')
    console.log(text)
    /* 13 is for enter key and display the message created by the user on screen */
    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            console.log(text.val())
            socket.emit('message', text.val());
            text.val('')
        }
    });
    socket.on('createMessage', message => {
        console.log('this is coming from server', message)
        $('.messages').append(`<li class="message"><b>USER</b></br>${message}</li>`)
    })
})

/* Function to remove the user when they leave the meeting */
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})  

/* Function to let a new user join a room */
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

/* Function to connect the new user with video and audio enabled */
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call
}

/* Function to add the video stream of the users' to te screen */
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
}

/* Let's the users' scroll to see their previous messages */
const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scollHeight"));
}

/* Start of function to let user mute and unmute audio */
    const muteUnmute = () => {
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if (enabled) {
            myVideoStream.getAudioTracks()[0].enabled = false;
            setUnmuteButton();
        } else {
            setMuteButton();
            myVideoStream.getAudioTracks()[0].enabled = true;
        }
    }

    const setMuteButton = () => {
        const html = `
            <i class="fas fa-microphone"></i>
            <span>Mute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
    }

    const setUnmuteButton = () => {
        const html = `
            <i class="unmute fas fa-microphone-slash"></i>
            <span>Unmute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
    }
/* End of mute and unmute */

/* Start of function to let user start and stop video */
    const playStop = () => {
        let enabled = myVideoStream.getVideoTracks()[0].enabled;
        if (enabled) {
            myVideoStream.getVideoTracks()[0].enabled = false;
            setPlayVideo()
        } else {
            setStopVideo()
            myVideoStream.getVideoTracks()[0].enabled = true;
        }
    }

    const setStopVideo = () => {
        const html = `
            <i class="play fas fa-video"></i>
            <span>Stop Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
    }

    const setPlayVideo = () => {
        const html = `
            <i class="stop fas fa-video-slash"></i>
            <span>Play Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
    }
/* End of play and stop */

/* Funtion to let user share screen */
async function startCapture(displayMediaOptions) {
    const myVideo1 = document.createElement('video');
    try {
        addVideoStream(myVideo1, await navigator.mediaDevices.getDisplayMedia(displayMediaOptions));
     } catch(err) {
      console.error("Error: " + err);
    }
}
