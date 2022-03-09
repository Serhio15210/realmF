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
export const createListForUser = async (name, filmsData) => {
    const listId = new ObjectId()
    try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas")
        const collectionLists = mongodb.db("Auth").collection("Lists")
        await collectionLists.insertOne({
            listId: listId,
            userID: app.currentUser.id,
            name: name,
            subscribers:0,
            films: filmsData
        })
        await addListToUser(listId)
        Alert.alert(`List ${name} was successfully created`)
    } catch (e) {
        Alert.alert(`Error creating:${e.message}`);
    }

}

const addListToUser = async (listId) => {
    const update = {
        "$push": {
            "lists":
                {listId: listId}

        }
    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Users")

    await collectionUser.updateOne({"userID": `${app.currentUser.id}`}, update)
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
export const getUserListById = async (id) => {

    try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas")
        const collectionLists = mongodb.db("Auth").collection("Lists")
        const lists = await collectionLists.find({"listId": {"$eq": id}})

        return lists
    } catch (error) {
        console.error(error);
    }

}
export const updateListName = async (newName, listId) => {
    const update = {
        "$set": {
            "name": newName

        }
    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionLists = mongodb.db("Auth").collection("Lists")
    await collectionLists.updateOne({"listId": {"$eq": listId}}, update)
}
export const addFilmToList = async (listId, film) => {
    const updateLists = {
        "$push": {
            "films": film

        }
    };

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionLists = mongodb.db("Auth").collection("Lists")

    await collectionLists.updateOne({"listId": {"$eq": listId}}, updateLists)

}
export const addFilmToFavoriteList = async (listId, film) => {
    const updateFavoriteList = {
        "$push": {
            "favoriteList":{
                "films": film
            }

        }
    };

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUsers = mongodb.db("Auth").collection("Users")

    await collectionUsers.updateOne({
            "favoriteList":
                {"listId": {"$eq": listId}}
        }
        , updateFavoriteList)

}
export const deleteList = async (listId) => {
    const updateLists = {
        "$pull": {
            "lists":{
                "listId": listId
            }

        }
    };
    const deleteList={
        "listId":listId
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUsers = mongodb.db("Auth").collection("Users")

    await collectionUsers.updateOne({
            "lists":
                {"listId": listId}
        }
        , updateLists)

    const collectionLists = mongodb.db("Auth").collection("Lists")
    await collectionLists.deleteOne(deleteList)

}
