import {ObjectId} from "bson";
import app from "../realmApp";
import {Alert} from "react-native";
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
export const getFavoriteListData=async()=>{
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
export const addFilmToFavoriteList = async (list, film) => {
    const updateFavoriteList = {
        "$set": {
                "favoriteList":{
                    ...list,
                    "films": [...list.films,film]
                }


        }
    };

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUsers = mongodb.db("Auth").collection("Users")


    await collectionUsers.updateOne({"userID": {"$eq": app.currentUser.id}}, updateFavoriteList)
}
export const deleteFilmFromFavoriteList = async (list, film) => {
    const updateFavoriteList = {
        "$set": {
            "favoriteList":{
                ...list,
                "films": list.films.filter(item=>item.filmId!==film.filmId)
            }


        }
    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUsers = mongodb.db("Auth").collection("Users")

    await collectionUsers.updateOne({"userID": {"$eq": app.currentUser.id}}
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
