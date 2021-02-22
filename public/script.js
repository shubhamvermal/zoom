
const socket = io('/')
const videoGrid = document.getElementById('video-grid'); // get element
const myVideo = document.createElement('video') // create video tag
myVideo.muted = true // for mute

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030',
}); 


let myVideoStream  
//accessing video and audio from chrome
console.log('navigator===>', navigator)
navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then(stream=>{
    myVideoStream = stream
    addVideoStream(myVideo, stream)
    
    peer.on('call', (call)=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (id)=>{
        connectToNewUser(id, stream)
    })
})


peer.on('open', id=>{
    console.log('id', id)
    socket.emit('join-room', ROOM_ID, id);
})


// socket.on('user-connected', (id)=>{
//     connectToNewUser(id, stream)
// })

const connectToNewUser = (id, stream ) => {
    console.log('new user', id)
    const call = peer.call(id, stream);
    const video = dovument.createElement('video')
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream)
    })
}

// const addVideoStream = (video, stream) =>{
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', ()=>{
//         video.play()
//     })
//     videoGrid.append(video)
// }

// combine vid tag with stream
const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })

    videoGrid.append(video)   
}