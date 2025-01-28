import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, addBoardMsg, removeBoardMsg, getGroupById, getGroups, removeGroup, addGroup, updateGroup } from './board.controller.js'

export const boardRoutes = express.Router()

boardRoutes.get('/:id/group/', getGroups)
boardRoutes.get('/:id/group/:groupId', getGroupById)
boardRoutes.delete('/:id/group/:groupId', removeGroup)
boardRoutes.post('/:id/group/', addGroup)
boardRoutes.put('/:id/group/:groupId', updateGroup)

boardRoutes.get('/', getBoards)
boardRoutes.get('/:id', getBoardById)
boardRoutes.post('/', requireAuth, addBoard)
boardRoutes.put('/:id', requireAuth, updateBoard)
boardRoutes.delete('/:id', requireAuth, removeBoard)
// boardRoutes.delete('/:id', requireAuth, requireAdmin, removeBoard)

boardRoutes.post('/:id/msg', requireAuth, addBoardMsg)
boardRoutes.delete('/:id/msg/:msgId', requireAuth, removeBoardMsg)