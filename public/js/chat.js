const socket = io();
const form = document.getElementById('formField');
const sendLocation = document.getElementById('sendLocation');
const formInput = document.querySelector('input');
const formButton = document.querySelector('button');
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#chatSidebar');

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});

const autoScroll = ()=>{
    let newMessage = messages.lastElementChild
    let newMessageStyle = getComputedStyle(newMessage);
    let newMessageMargin = parseInt(newMessageStyle.marginBottom);
    let newMessageHeight = newMessage.offsetHeight+newMessageMargin;

    let visibleHeight = messages.offsetHeight;
    let containerHeight = messages.scrollHeight;

    let scrollOffset = messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight;
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    formButton.setAttribute('disabled','disabled');
    let msg = e.target.elements.message.value;
    socket.emit('newMessage',msg,(error)=>{

        formButton.removeAttribute('disabled');
        formInput.value='';
        formInput.focus();

        if(error){
            return console.log(error);
        }
    });
})

socket.on('message',(msg,user)=>{
    let html = Mustache.render(messageTemplate,{
        msg: msg.text,
        user: user,
        createdAt:moment(msg.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

socket.on('location',(loc,user)=>{
    let html = Mustache.render(locationTemplate,{
        loc: loc.url,
        user: user.username,
        createdAt: moment(loc.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

socket.on('roomData',(users,room)=>{
    let html = Mustache.render(sidebarTemplate,{
        users,
        room
    })

    sidebar.innerHTML = html; 
})

sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation) return 'This browser does not support geolocation';
    sendLocation.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition(position=>{
        socket.emit('locationData',{latitude: position.coords.latitude,longitude: position.coords.longitude},()=>{
            console.log('Location Shared');
            sendLocation.removeAttribute('disabled');
        });
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
});
