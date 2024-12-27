import User from "../models/User.js";
import Contact from "../models/Contact.js";
import argon2 from 'argon2'

async function login(req, res, next) {
    try {
        const { Email, Password } = req.body;
        const check = await User.findOne({Email})
        console.log(req.body);

        if (check) {
            res.json({ value: true })
        }
        else {
            const hash = await argon2.hash(Password)
            const user = await User.create(
                {
                    Email,
                    Password: hash
                }
            )
            console.log(user);

            res.json({ value: false, id: user._id })
        }
    } catch (ex) {
        next(ex)
    }
}

async function signIn(req, res, next) {
    try {
        const { Email, Password } = req.body;
        console.log(Email, Password);

        const getUser = await User.findOne({Email})
        console.log(getUser);

        if (getUser) {

            if (await argon2.verify(getUser.Password, Password)) {
                if(getUser.ProfilePic===undefined || getUser.ProfilePic===null){
                    res.json({isInfoSet:false,value:true,id:getUser._id})
                }
                else
                res.json({isInfoSet:true, value: true,user:{id:getUser._id, username:getUser.Username, about:getUser.AboutMe,profile:getUser.ProfilePic}})
            }
            else {
                res.json({ value: false })
            }
        }
        else {
            res.json({ notUser: true })
        }
    } catch (ex) {
        next(ex)
    }
}

async function getName(id) {
    const data = await User.findOne({ _id: id }, { Password: 0 })
    return { username: data.Username, id: data._id, profile:data.ProfilePic ,about : data.AboutMe}
}

async function getContacts(req, res, next) {
    try {
        const userId = req.params.id
        console.log(userId)
        const data = await Contact.findOne({ user: userId })
        if (data) {

            const list = await Promise.all(data.friends.map(async (f) => {
                const name = await getName(f)
                return name
            })
            )
            console.log(list);
            return res.json(list)
        }
        return res.json([])

    } catch (ex) {
        next(ex)
    }
}

async function getFriends(req, res, next) {
    try {
        const name = req.body.name
        const friends = req.body.friends
        const regex = new RegExp(name, 'i')

        function check(id) {
            for (var i = 0; i < friends.length; i++) {
                if (friends[i] == id) {

                    return false
                }
            }
            return true
        }

        const data = await User.find({ Username: { $regex: regex } }, { Password: 0 ,Email:0,AboutMe:0})
        const response = data.filter((con) => {
            return check(con._id)
        })
        console.log(response);

        return res.json(response)
    } catch (ex) {
        next(ex)
    }

}

async function getUsers(req, res, next) {
    try {
        const id = req.params.id
        const data = await User.findOne({_id: id}, {Password:0,Email:0})
        res.json(data)
    } catch (ex) {
        next(ex)
    }
}

async function getUserData(id){
    const data = await User.findOne({_id: id}, {Password:0,Email:0})
    return data
}

const addInfo = async function (body,path) {
    const data = await User.updateOne({_id:body.id}, {Username:body.username, AboutMe:body.aboutme,ProfilePic:path})
    console.log(data);
}

const getUserByName = async function (req, res, next) {
    const name = req.body.name
    const data = await User.findOne({Username:name}, {Password:0})
    const value = data ? true : false
    res.json({value})
}

const updateUser = async function (data,id) {
    const data1 = await User.updateOne({_id:id},data)
    const value = await getName(id)
    return value
}

export { login, signIn, getContacts, getFriends ,getName,getUsers,addInfo,getUserData,getUserByName,updateUser} 
