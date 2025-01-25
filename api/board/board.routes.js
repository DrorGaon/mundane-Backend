import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, addBoardMsg, removeBoardMsg } from './board.controller.js'

export const boardRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

boardRoutes.get('/', log, getBoards)
boardRoutes.get('/:id', getBoardById)
boardRoutes.post('/', requireAuth, addBoard)
boardRoutes.put('/:id', requireAuth, updateBoard)
boardRoutes.delete('/:id', requireAuth, removeBoard)
// boardRoutes.delete('/:id', requireAuth, requireAdmin, removeBoard)

boardRoutes.post('/:id/msg', requireAuth, addBoardMsg)
boardRoutes.delete('/:id/msg/:msgId', requireAuth, removeBoardMsg)