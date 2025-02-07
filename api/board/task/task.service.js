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
	removeTasks,
	duplicateTasks,
	archiveTasks,
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

async function removeTask(boardId, groupId, taskId, isBulkAction = false) {
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
		if (!isBulkAction) return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
	} catch (err) {
		logger.error(`while finding tasks in group ${groupId}`, err)
		throw err
	}
}

async function addTask(boardId, groupId, task, isDuplicate = false) {
	try {
		task.id = utilService.makeId()

		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
		}
	
		const add = isDuplicate 
		? {
        	$push: {
        	  "groups.$.tasks": {
        	    $each: [task],
        	    $position: task.idx + 1
        	  	}
        	}
		}
		: { 
			$push: { "groups.$.tasks": task } 
		}
		
		if(isDuplicate) {
			delete task.idx
			delete task.groupId
			task.title += ' (copy)'
		}

		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, add)

		if (!modifiedCount) throw new Error('problem adding task')
		if (!isDuplicate) return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
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

async function removeTasks( boardId, taskAndGroupIds ) {
	try {
		for (const ids of taskAndGroupIds) {
			await removeTask(boardId, ids.groupId, ids.taskId)
		}
		const collection = await dbService.getCollection('board')
		return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})	
	} catch (err) {
		logger.error(`while removing tasks`, err)
		throw err
	}
}	

async function duplicateTasks( boardId, tasks ) {
	try {
		const collection = await dbService.getCollection('board')
		const board = await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
		for (const task of [...tasks].reverse()) {
			const group = board.groups.find(group => group.id === task.groupId)
			task.idx = group.tasks.findIndex(t => t.id === task.id)
			await addTask(boardId, group.id, task, true)
		}
		return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})	
	} catch (err) {
		logger.error(`while duplicating tasks`, err)
		throw err
	}
}	

async function archiveTasks(boardId, tasks){
	try {
		const updatedTasks = tasks.map(task => ({...task, archivedAt: Date.now()}))
		for (const task of updatedTasks) {
			await updateTask(boardId, task.groupId, task)
		}
		const collection = await dbService.getCollection('board')
		const board = await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
		return board
	} catch (err) {
		logger.error(`while archiving tasks`, err)
		throw err
	}
}