let users = [];

let addUser = ({id, username, room})=>{
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return{
            error: 'Username and Room are required'
        }
    }

    let exists = users.find(user=>{
        return user.room===room && user.username===username;
    })

    if(exists){
        return{
            error: 'Username already in use'
        }
    }

    let user= {id,username,room};
    users.push(user);

    return {user};
}

let removeUser = (id)=>{
    let index = users.findIndex(user=> user.id===id);
    if(index!=-1){
        return users.splice(index,1)[0];
    }
}

let getUser = (id)=>{
    let user = users.find(user=>{
        return user.id===id;
    })

    return user;
}

let getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    let roomUsers = users.filter(user=>{
        return user.room === room;
    })

    return roomUsers;
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}