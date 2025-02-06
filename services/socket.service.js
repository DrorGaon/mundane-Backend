import { Server } from "socket.io";

var gIo = null

export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })

    gIo.on('connection', socket => {

        socket.on('set-viewed-board', boardId => {
            if (socket.boardId === boardId) return
            if (socket.boardId) {
                socket.leave(socket.boardId)
            }
            socket.join(boardId)
            socket.boardId = boardId
        })

        socket.on('set-user-socket', userId => {
            socket.userId = userId
        })

        socket.on('unset-user-socket', () => {
            delete socket.userId
        })

    })
}

async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    const excludedSocket = await _getSocketById(userId)
    if (room && excludedSocket) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        gIo.to(room).emit(type, data)
    } else {
        gIo.emit(type, data)
    }
}


async function _getSockets() {
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _getSocketById(userId) {
    const sockets = await _getSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}

export const socketService = {
    broadcast,
}