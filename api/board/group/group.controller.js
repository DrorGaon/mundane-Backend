import { logger } from "../../../services/logger.service.js"
import { groupService } from "./group.service.js"

export async function getGroups(req, res) {
    try {
        const { id: boardId } = req.params
        const group = await groupService.getGroups(boardId)
        res.json(group)
    } catch (err) {
        logger.error('Failed to get groups', err)
        res.status(500).send({ err: 'Failed to get groups' })
    }
}

export async function getGroupById(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const group = await groupService.getGroupById(boardId, groupId)
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
        const board = await groupService.removeGroup(boardId, groupId)
        res.send(board)
    } catch (err) {
        logger.error('Failed to remove group', err)
        res.status(500).send({ err: 'Failed to remove group' })
    }
}

export async function addGroup(req, res) {
    try {
        const { id: boardId } = req.params
        const group = req.body
        const board = await groupService.addGroup(boardId, group)
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
        const board = await groupService.updateGroup(boardId, group)
        res.json(board)
    } catch (err) {
        logger.error('Failed to update group', err)
        res.status(500).send({ err: 'Failed to update group' })
    }
}
