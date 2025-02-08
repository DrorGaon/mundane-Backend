import { ObjectId } from "mongodb"

import { dbService } from "../../../services/db.service.js"
import { utilService } from "../../../services/util.service.js"
import { logger } from "../../../services/logger.service.js"

export const groupService = {
    getGroups,
    getGroupById,
    removeGroup,
    addGroup,
    updateGroup,
}

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

        if (!modifiedCount) throw new Error('problem removing group')
        return await collection.findOne({_id: ObjectId.createFromHexString(boardId)})
    } catch (err) {
        logger.error(`while removing group ${groupId}`, err)
        throw err
    }
}

async function addGroup(boardId, group, isUnshift) {
    try {
        group.id = utilService.makeId()
        const criteria = {
            _id: ObjectId.createFromHexString(boardId),
        }
        
        const add = isUnshift 
        ? {
              $push: {
                groups: {
                  $each: [group],
                  $position: 0
                }
              }
        }
        : { $push: { groups: group}}

        const collection = await dbService.getCollection('board')
        const { modifiedCount } = await collection.updateOne(criteria, add)

        if (!modifiedCount) throw new Error('problem adding group')
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
        
        if (!modifiedCount) throw new Error('problem updating group')
        return await collection.findOne( {_id: ObjectId.createFromHexString(boardId)})
    } catch (err) {
        logger.error(`while updating group ${group.id}`, err)
        throw err
    }
}
