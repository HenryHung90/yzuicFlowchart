const socketServer = (io) => {
    io.on('connection', (socket) => {
        console.log("user connected")

        socket.on('enterRoom', (message) => {
            io.emit('re-enterRoom', message)
        })

        socket.on('sendMessage', (message) => {
            console.log(message)
            // 全域發出
            io.emit('re-sendMessage', message)
            // 只有自己收的到
            // socket.emit('re-sendMessage', message)
        })
    })
}

export default socketServer