import Contact from "../models/Contact.js";
import Req from "../models/FriendReq.js";
import User from "../models/User.js";

const sendReq = async (req, res, next) => {
    try {
        const { sender, receiver } = req.body
        const result = await Req.create({
            sender,
            receiver
        })
        console.log(result);
        res.json({ value: true })
    } catch (ex) {
        next(ex)
    }
}

async function getName(id) {
    const data = await User.findOne({ _id: id }, { Password: 0 })
    return { name: data.Username, id: data._id }
}

const getReq = async (req, res, next) => {
    try {
        const id = req.body.id
        console.log(id);

        const data = await Req.find({ receiver: id });
        if (data) {
            const list = await Promise.all(data.map(async (f) => {

                const name = await getName(f.sender)
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

const handelRequest = async (user,friend,value) => {
    try {
        if (value) {
            addFriends(user, friend)
        }
        await Req.deleteOne({ sender: friend, receiver:user})
    } catch (ex) {
        console.log(ex);
        
    }
}

async function addFriends(user, friend) {
    try {
        const find = await Contact.findOne({ user: user })
        if (find) {

            const data = await Contact.updateOne(
                { user: user },
                { $push: { friends: friend } }
            )
        }
        else {
            const data = await Contact.create(
                { user: user, friends: [friend] }
            )
        }

        const find2 = await Contact.findOne({ user: friend })
        if (find2) {

            const data = await Contact.updateOne(
                { user: friend },
                { $push: { friends: user } }
            )
        }
        else {
            const data = await Contact.create(
                { user: friend, friends: [user] }
            )
        }
    } catch (ex) {
        next(ex)
    }
}

export { getReq, sendReq, handelRequest }