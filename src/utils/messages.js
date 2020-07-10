const generateMessage = (message)=>{
    return {
        text: message,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (url)=>{
    return{
        url,
        createdAt: new Date().getTime()
    }
}

module.exports= {
    generateMessage,
    generateLocation
}