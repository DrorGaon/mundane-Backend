import express from 'express'

// import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, } from './board.controller.js'
import { addGroup, getGroupById, getGroups, removeGroup, updateGroup } from './group/group.controller.js'
import { addTask, getTaskById, getTasks, removeTask, removeTasks, updateTask } from './task/task.controller.js'

export const boardRoutes = express.Router()

// removed authentication for now //

//task
boardRoutes.get('/:id/group/:groupId/task', getTasks)
boardRoutes.get('/:id/group/:groupId/task/:taskId', getTaskById)
boardRoutes.delete('/:id/group/:groupId/task/:taskId', removeTask)
boardRoutes.post('/:id/group/:groupId/task', addTask)
boardRoutes.put('/:id/group/:groupId/task/:taskId', updateTask)

//group
boardRoutes.get('/:id/group/', getGroups)
boardRoutes.get('/:id/group/:groupId', getGroupById)
boardRoutes.delete('/:id/group/:groupId', removeGroup)
boardRoutes.post('/:id/group/', addGroup)
boardRoutes.put('/:id/group/:groupId', updateGroup)

//bulk actions
boardRoutes.delete('/:id/tasks', removeTasks)

//board
boardRoutes.get('/', getBoards)
boardRoutes.get('/:id', getBoardById)
boardRoutes.post('/', addBoard)
boardRoutes.put('/:id', updateBoard)
boardRoutes.delete('/:id', removeBoard)

