import { boardService } from './board.service.js'
import { logger } from '../../services/logger.service.js'

export async function getBoards(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
        }
        const boards = await boardService.query(filterBy)
        res.json(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

export async function getBoardById(req, res) {
    try {
        const boardId = req.params.id
        const board = await boardService.getById(boardId)
        res.json(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(500).send({ err: 'Failed to get board' })
    }
}

export async function addBoard(req, res) {
    const { loggedinUser } = req

    try {
        const board = req.body
        board.createdBy = loggedinUser
        const addedBoard = await boardService.add(board)
        res.json(addedBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}

export async function updateBoard(req, res) {
    try {
        const board = { ...req.body, _id: req.params.id }
        const updatedBoard = await boardService.update(board)
        res.json(updatedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

export async function removeBoard(req, res) {
    try {
        const boardId = req.params.id
        const deletedCount = await boardService.remove(boardId)
        res.send(`${deletedCount} boards removed`)
    } catch (err) {
        logger.error('Failed to remove board', err)
        res.status(500).send({ err: 'Failed to remove board' })
    }
}

export async function getGroups(req, res) {
    try {
        const { id: boardId } = req.params
        const group = await boardService.getGroups(boardId)
        res.json(group)
    } catch (err) {
        logger.error('Failed to get groups', err)
        res.status(500).send({ err: 'Failed to get groups' })
    }
}

export async function getGroupById(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const group = await boardService.getGroupById(boardId, groupId)
        res.json(group)
    } catch (err) {
        logger.error('Failed to get group', err)
        res.status(500).send({ err: 'Failed to get group' })
    }
}

export async function removeGroup(req, res) {
    console.log('delete group')
    try {
        const { id: boardId, groupId } = req.params
        const deletedCount = await boardService.removeGroup(boardId, groupId)
        res.send(`${deletedCount} groups removed`)
    } catch (err) {
        logger.error('Failed to remove group', err)
        res.status(500).send({ err: 'Failed to remove group' })
    }
}

export async function addGroup(req, res) {
    try {
        const { id: boardId } = req.params
        const group = req.body
        const board = await boardService.addGroup(boardId, group)
        res.json(board)
    } catch (err) {
        logger.error('Failed to add group', err)
        res.status(500).send({ err: 'Failed to add group' })
    }
}

export async function updateGroup(req, res) {
    try {
        const { id: boardId } = req.params
        const group = req.body
        const board = await boardService.updateGroup(boardId, group)
        res.json(board)
    } catch (err) {
        logger.error('Failed to update group', err)
        res.status(500).send({ err: 'Failed to update group' })
    }
}

export async function addBoardMsg(req, res) {
    const { loggedinUser } = req
    try {
        const boardId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await boardService.addBoardMsg(boardId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

export async function removeBoardMsg(req, res) {
    try {
        const { id: boardId, msgId } = req.params

        const removedId = await boardService.removeBoardMsg(boardId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board msg', err)
        res.status(500).send({ err: 'Failed to remove board msg' })
    }
}