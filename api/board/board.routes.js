import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, getGroupById, getGroups, removeGroup, addGroup, updateGroup, getTasks, getTaskById, removeTask, addTask, updateTask } from './board.controller.js'

export const boardRoutes = express.Router()

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

//board
boardRoutes.get('/', getBoards)
boardRoutes.get('/:id', getBoardById)
boardRoutes.post('/', requireAuth, addBoard)
boardRoutes.put('/:id', requireAuth, updateBoard)
boardRoutes.delete('/:id', requireAuth, removeBoard)

