/* eslint-disable */
import {Alert} from "react-native";
import BSON, {ObjectId} from "bson";
import app from "../realmApp";

export const UserSchema = {
    name: 'User',
    properties: {
        _id: 'objectId?',
        avatar: 'string?',
        userID: 'string?',
        username: 'string?',
    },
    primaryKey: '_id',
};

export const createUser = async (username) => {

    try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas")
        const collectionUser = mongodb.db("Auth").collection("Users")
        await collectionUser.insertOne({
            userID: app.currentUser.id,
            username: username,
            subscribers: [],
            subscriptions: [],
            lists: [],
            favoriteList: {listId: new ObjectId(), name: "Favorite", films: []}
        })
        Alert.alert(`User ${username} was successfully created`)
    } catch (e) {
        Alert.alert(`Error creating:${e.message}`);
    }

}
export const editUser = async (username) => {
    const update = {
        "$set": {
            "username": username

        }
    };
    try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas")
        const collectionUser = mongodb.db("Auth").collection("Users")
        await collectionUser.updateOne({"userID": {"$eq": app.currentUser.id}}, update)
        Alert.alert(`User ${username} was successfully updated`)
    } catch (e) {
        Alert.alert(`Error creating:${e.message}`);
    }

}

export const getCurrentUserData = async () => {
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")
    return await collectionUser.findOne({"userID": {"$eq": app.currentUser.id}})

}
export const getAllUsers = async () => {
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")
    return await collectionUser.find({"userID": {"$ne": app.currentUser.id}})

}
export const getUserById = async (id) => {

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")
    return  await collectionUser.findOne({"userID": {"$eq":  id}})
}
export const getCurrentUserLists = async () => {
    let lists
    let filteredLists
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionLists = mongodb.db("Auth").collection("Lists")
    lists = await collectionLists.find({"userID": {"$eq": app.currentUser.id}})

    filteredLists = lists.filter(list => list.userID === app.currentUser.id)

    // filteredLists.unshift(firstList)
    return filteredLists


}


export const subscribeUser = async (id,username,subUsername) => {

    const update = {
        "$push": {
            "subscribers": {userID:app.currentUser.id,username:username}

        }

    };
    const update2 = {
        "$push": {
            "subscriptions": {userID:id,username:subUsername}

        }

    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")

    await collectionUser.updateOne(
        {"userID": {"$eq": id}}, update)
    await collectionUser.updateOne(
        {"userID": {"$eq": app.currentUser.id}}, update2)


}
export const unSubscribeUser = async (id) => {

    const update = {
     $pull: { subscribers: {userID:app.currentUser.id}}

    };
    const update2 = {
        $pull: { subscriptions: {userID:id}}

    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")

    await collectionUser.updateOne(
        {"userID": {"$eq": id}}, update)
    await collectionUser.updateOne(
        {"userID": {"$eq": app.currentUser.id}}, update2)


}

export const getSubscribers = async (id) => {

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")
    const subscribers= await collectionUser.findOne({"userID": {"$eq":  id}})
    return subscribers.subscribers
}
export const getSubscriptions = async (id) => {

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")
    const subscribers= await collectionUser.findOne({"userID": {"$eq":  id}})
    return subscribers.subscriptions
}
