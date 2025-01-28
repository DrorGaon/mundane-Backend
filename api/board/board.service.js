import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
// import { utilService } from '../../services/util.service.js'

export const boardService = {
	remove,
	query,
	getById,
	add,
	update,
	getGroups,
	getGroupById,
	removeGroup,
	addGroup,
	updateGroup,
	// addBoardMsg,
	// removeBoardMsg,
}


// board
async function query(filterBy = { txt: '' }) {
	try {
		const criteria = {
			title: { $regex: filterBy.txt, $options: 'i' },
		}
		const collection = await dbService.getCollection('board')
		var boards = await collection.find(criteria).toArray()
		return boards
	} catch (err) {
		logger.error('cannot find boards', err)
		throw err
	}
}

async function getById(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		const board = await collection.findOne({ _id: ObjectId.createFromHexString(boardId) })
		board.createdAt = board._id.getTimestamp()
		return board
	} catch (err) {
		logger.error(`while finding board ${boardId}`, err)
		throw err
	}
}

async function remove(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(boardId) })
        return deletedCount
	} catch (err) {
		logger.error(`cannot remove board ${boardId}`, err)
		throw err
	}
}

async function add(board) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.insertOne(board)
		return board
	} catch (err) {
		logger.error('cannot insert board', err)
		throw err
	}
}

async function update(board) {
	try {
		const boardToSave = {
			title: board.title,
			groups: board.groups,
			members: board.members,
			cmpsOrder: board.cmpsOrder,
			statusLabels: board.statusLabels,
			priorityLabels: board.priorityLabels,
			activities: board.activities
		}
		const collection = await dbService.getCollection('board')
		await collection.updateOne({ _id: ObjectId.createFromHexString(board._id) }, { $set: boardToSave })
		return board
	} catch (err) {
		logger.error(`cannot update board ${board._id}`, err)
		throw err
	}
}


//group
async function getGroups(boardId) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId)
		}
		  
		  const projection = {
			_id: 0,
			"groups": 1
		}
		
		const collection = await dbService.getCollection('board')
		const res = await collection.findOne(criteria, {projection})
		const groups = res.groups
		return groups
	} catch (err) {
		logger.error(`while finding groups in board ${boardId}`, err)
		throw err
	}
}

async function getGroupById(boardId, groupId) {
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
		const group = res.groups[0]
		return group
	} catch (err) {
		logger.error(`while finding group ${groupId}`, err)
		throw err
	}
}

async function removeGroup(boardId, groupId) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId
		}

		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, { $pull: { groups: { id: groupId}}})
		if (!modifiedCount) throw new Error('problem getting board')
		return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
	} catch (err) {
		logger.error(`while removing group ${groupId}`, err)
		throw err
	}
}

async function addGroup(boardId, group) {
	try {
		group.id = utilService.makeId()
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
		}
		
		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, { $push: { groups: group}})
		if (!modifiedCount) throw new Error('problem getting board')
		return await collection.findOne(criteria)
	} catch (err) {
		logger.error(`while adding group`, err)
		throw err
	}
}

async function updateGroup(boardId, group) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": group.id
		}
		
		const collection = await dbService.getCollection('board')
		const { modifiedCount } = await collection.updateOne(criteria, { $set: { "groups.$": group}})
		if (!modifiedCount) throw new Error('problem getting board')
		return await collection.findOne( {_id: ObjectId.createFromHexString(boardId)})
	} catch (err) {
		logger.error(`while updating group ${group.id}`, err)
		throw err
	}
}