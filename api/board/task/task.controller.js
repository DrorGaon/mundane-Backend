import { logger } from "../../../services/logger.service.js"
import { taskService } from "./task.service.js"


export async function getTasks(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const tasks = await taskService.getTasks(boardId, groupId)
        res.json(tasks)        
    } catch (err) {
        logger.error('Failed to get tasks', err)
        res.status(500).send({ err: 'Failed to get tasks' })
    }
}

export async function getTaskById(req, res) {
    try {
        const { id: boardId, groupId, taskId } = req.params
        const task = await taskService.getTaskById(boardId, groupId, taskId)
        res.json(task)        
    } catch (err) {
        logger.error('Failed to get tasks', err)
        res.status(500).send({ err: 'Failed to get tasks' })
    }
}

export async function removeTask(req, res) {
    try {
        const { id: boardId, groupId, taskId } = req.params
        const board = await taskService.removeTask(boardId, groupId, taskId)
        res.json(board)        
    } catch (err) {
        logger.error('Failed to remove task', err)
        res.status(500).send({ err: 'Failed to remove task' })
    }
}

export async function addTask(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const task = req.body
        const board = await taskService.addTask(boardId, groupId, task)
        res.json(board)        
    } catch (err) {
        logger.error('Failed to add task', err)
        res.status(500).send({ err: 'Failed to add task' })
    }
}

export async function updateTask(req, res) {
    try {
        const { id: boardId, groupId } = req.params
        const task = req.body
        const board = await taskService.updateTask(boardId, groupId, task)
        res.json(board)        
    } catch (err) {
        logger.error('Failed to add task', err)
        res.status(500).send({ err: 'Failed to add task' })
    }
}

export async function removeTasks(req, res) {
    try {
        const { id: boardId } = req.params
        const taskAndGroupIds = req.body
        const board = await taskService.removeTasks(boardId, taskAndGroupIds)
        res.json(board)        
    } catch (err) {
        logger.error('Failed to remove tasks', err)
        res.status(500).send({ err: 'Failed to remove tasks' })
    }
}

export async function duplicateTasks(req, res) {
    try {
        const { id: boardId } = req.params
        const tasks = req.body
        const board = await taskService.duplicateTasks(boardId, tasks)
        res.json(board)        
    } catch (err) {
        logger.error('Failed to duplicate', err)
        res.status(500).send({ err: 'Failed to duplicate' })
    }
}