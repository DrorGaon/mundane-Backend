import { ObjectId } from "mongodb"

import { logger } from "../../../services/logger.service.js"
import { utilService } from "../../../services/util.service.js"
import { dbService } from "../../../services/db.service.js"

export const taskService = {
    getTasks,
    getTaskById,
    removeTask,
    addTask,
    updateTask,
}


async function getTasks(boardId, groupId) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId
		}
		  
		  const projection = {
			_id: 0,
			"groups.$": 1
		}

		const collection = await dbService.getCollection('board')
		const res = await collection.findOne(criteria, {projection})

		const tasks = res.groups[0].tasks
		return tasks
	} catch (err) {
		logger.error(`while finding tasks in group ${groupId}`, err)
		throw err
	}
}

async function getTaskById(boardId, groupId, taskId) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
			"groups.tasks.id": taskId
		}
		  
		  const projection = {
			_id: 0,
			"groups.$": 1
		}

		const collection = await dbService.getCollection('board')
		const res = await collection.findOne(criteria, {projection})

		const task = res.groups[0].tasks.find(task => task.id === taskId)
		return task
	} catch (err) {
		logger.error(`while finding tasks in group ${groupId}`, err)
		throw err
	}
}

async function removeTask(boardId, groupId, taskId) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
		}
	
		const remove = { 
			$pull: { "groups.$.tasks": { id: taskId } } 
		}

		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, remove)

		if (!modifiedCount) throw new Error('problem removing task')
		return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
	} catch (err) {
		logger.error(`while finding tasks in group ${groupId}`, err)
		throw err
	}
}

async function addTask(boardId, groupId, task) {
	try {
		task.id = utilService.makeId()

		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
		}
	
		const add = { 
			$push: { "groups.$.tasks": task } 
		}

		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, add)

		if (!modifiedCount) throw new Error('problem adding task')
		return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
	} catch (err) {
		logger.error(`while finding tasks in group ${groupId}`, err)
		throw err
	}
}

async function updateTask(boardId, groupId, task) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
		}
	
		const update = {
			$set: {
			  "groups.$.tasks.$[elem]": task  
			}
		}

		const arrayFilters = [
			{ "elem.id": task.id }  
		]

		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, update, { arrayFilters })
        
		if (!modifiedCount) throw new Error('problem updating task')
		return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
	} catch (err) {
		logger.error(`while finding tasks in group ${groupId}`, err)
		throw err
	}
}