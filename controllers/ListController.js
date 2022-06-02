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
            subscribers:[],
            films: filmsData
        })
        await addListToUser(listId)
        Alert.alert(`List ${name} was successfully created`)
    } catch (e) {
        Alert.alert(`Error creating:${e.message}`);
    }
    return listId

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
export const getUserLists = async (id) => {

    try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas")
        const collectionLists = mongodb.db("Auth").collection("Lists")
        return await collectionLists.find({"userID": {"$eq": id}})


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
export const deleteFilmFromList = async (list, film) => {
    const updateLists = {
        "$set": {
            "films": list.films.filter(item=>item.filmId!==film.filmId)

        }
    };

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionLists = mongodb.db("Auth").collection("Lists")

    await collectionLists.updateOne({"listId": {"$eq": list.listId}}, updateLists)

}
export const addFilmToFavoriteList = async (list, film) => {
    // console.log(film)
    const updateFavoriteList = {
        "$set": {
                "favoriteList":{
                    ...list,
                    "films": list.films.concat([film])
                }
        }
    };

    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUsers = mongodb.db("Auth").collection("Users")


    await collectionUsers.updateOne({"userID": {"$eq": app.currentUser.id}}, updateFavoriteList)
}
export const addFilmArrayToFavoriteList = async (list, film) => {
    // console.log(film)
    const updateFavoriteList = {
        "$set": {
            "favoriteList":{
                ...list,
                "films": [...list.films,...film]
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

    await collectionUsers.updateOne({"userID": {"$eq": app.currentUser.id}}
        , updateLists)

    const collectionLists = mongodb.db("Auth").collection("Lists")
    await collectionLists.deleteOne(deleteList)

}
export const subscribeUserToList = async (id,username) => {

    const update = {
        "$push": {
            "subscribers": {userID:app.currentUser.id,username:username}

        }

    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Lists")

    await collectionUser.updateOne(
        {"userID": {"$eq": id}}, update)

}
export const unSubscribeUserFromList = async (id) => {

    const update = {
        $pull: { subscribers: {userID:app.currentUser.id}}

    };
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Lists")

    await collectionUser.updateOne(
        {"userID": {"$eq": id}}, update)

}

export const rateFilm=async (id, rate, filmId,films) => {

    const index = films.findIndex(object => {
        return object.filmId === filmId;
    });
    const selectFilm=films.filter(film=>film.filmId===filmId)[0]
    films[index]={...selectFilm,'rate':rate}
    const mongodb = app.currentUser.mongoClient("mongodb-atlas")
    const collectionUser = mongodb.db("Auth").collection("Lists")

    await collectionUser.updateOne({"listId": {"$eq": id}},{
        "$set": {
            "films": films

        }
    } )
    return films
}
