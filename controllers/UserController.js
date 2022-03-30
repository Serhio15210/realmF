/* eslint-disable */
import {Alert} from "react-native";
import {ObjectId} from "bson";
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





