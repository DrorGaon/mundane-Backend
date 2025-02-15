import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const boardService = {
	remove,
	query,
	getById,
	add,
	update,
}

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
			activities: board.activities, 
			isStarred: board.isStarred,
		}
		const collection = await dbService.getCollection('board')
		await collection.updateOne({ _id: ObjectId.createFromHexString(board._id) }, { $set: boardToSave })
		return board
	} catch (err) {
		logger.error(`cannot update board ${board._id}`, err)
		throw err
	}
}