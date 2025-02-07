import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, } from './board.controller.js'
import { addGroup, getGroupById, getGroups, removeGroup, updateGroup } from './group/group.controller.js'
import { addTask, archiveTasks, duplicateTasks, getTaskById, getTasks, removeTask, removeTasks, updateTask } from './task/task.controller.js'

export const boardRoutes = express.Router()

//task
boardRoutes.get('/:id/group/:groupId/task', getTasks)
boardRoutes.get('/:id/group/:groupId/task/:taskId', getTaskById)
boardRoutes.delete('/:id/group/:groupId/task/:taskId', requireAuth, removeTask)
boardRoutes.post('/:id/group/:groupId/task', requireAuth, addTask)
boardRoutes.put('/:id/group/:groupId/task/:taskId', requireAuth, updateTask)

//group
boardRoutes.get('/:id/group/', getGroups)
boardRoutes.get('/:id/group/:groupId', getGroupById)
boardRoutes.delete('/:id/group/:groupId', requireAuth, removeGroup)
boardRoutes.post('/:id/group/', requireAuth, addGroup)
boardRoutes.put('/:id/group/:groupId', requireAuth, updateGroup)

//bulk actions
boardRoutes.delete('/:id/tasks', requireAuth, removeTasks)
boardRoutes.post('/:id/tasks', requireAuth, duplicateTasks)
boardRoutes.put('/:id/tasks', requireAuth, archiveTasks)

//board
boardRoutes.get('/', getBoards)
boardRoutes.get('/:id', getBoardById)
boardRoutes.post('/', requireAuth, addBoard)
boardRoutes.put('/:id', requireAuth, updateBoard)
boardRoutes.delete('/:id', requireAuth, removeBoard)

