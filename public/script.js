

const socket = io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
var peer = new Peer();
myVideo.muted = true;
let myVideoStream
navigator.mediaDevices.getUserMedia({

// For permissions 

    video: true,
    audio: true
}).then(stream => {
    // If permission granted
    myVideoStream = stream;
    myVideo.autoplay = true;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {

        call.answer(stream);
        const video=document.createElement('video')
     
        call.on('stream', (userVideoStream)=>{
            video.autoplay = true;
            addVideoStream(video,userVideoStream)    
          });
        

    });
    // New user is connected then it passes the userid and stream of current user to new user
 

     let text=$('input');

    $('html').keydown((e)=>{
        if(e.which==13 && text.val().length !==0){
            console.log(text.val());
            socket.emit('message',text.val());
            text.val('');
            // make input textbox empty when message has been send 
        }
    })

    socket.on('createMessage',message=>{
        // console.log("Message from script "+message);
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom();
    })


    socket.on('user-connected', (userId) => {
        connectedTonewUser(userId,stream);
     })
})





peer.on('open',id=>{
    // console.log(id);
    socket.emit('join-room',ROOM_ID,id);
})
// socket.emit('join-room',ROOM_ID);


// ROOM_ID Comes from ejs file and emit it so we can join the room by specific id so pass id
// Emit the event which passes the controll to server.js




const connectedTonewUser = (userId,stream) => {
//    call the new user by id and passing my stream to new user
    const call=peer.call(userId,stream);
    // Creating the video element for new user
    const video=document.createElement('video');
// When get the new user stream it will add it 
    call.on('stream',(userVideoStream) => {
        addVideoStream(video,userVideoStream);
    })
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
} 


const scrollToBottom =()=>{
    let d=$('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}


// Mute Function
const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setUnmuteButton =()=>{
    const html=`
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    
    `
    document.querySelector('.main__mute__button').innerHTML=html;

}

const setMuteButton= ()=>{
    const html=`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML=html;
}


const playStop =()=>{
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}

const setPlayVideo =()=>{
    const html=
    `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;

}
const setStopVideo=()=>{
    const html=`
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}

// Socket.emit will emit
// socket.on receive