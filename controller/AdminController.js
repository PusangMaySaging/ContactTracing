const dbUtils = require('../utils/dbUtils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
module.exports = {

    signIn: async (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const database = await dbUtils.connectToDb();
            const dbResult = await database.collection('users').findOne({ username: username });
            const isPasswordTheSame = await bcrypt.compare(password, dbResult);
            if (dbResult == null) {
                res.send("INVALID EMAIL");
            }
            const user = {
                id: dbResult._id,
                username: dbResult.username,
                name: dbResult.name,
                role: dbResult.role
            }
            if (isPasswordTheSame) {
                req.session.user = user;
                console.log(req.session.user)
                const accessToken = jwt.sign(req.session.user, process.env.JWT_SECRET)
                const refreshToken = jwt.sign(req.session.user, process.env.JWT_REFRESH_SECRET)
                res.cookie("refreshToken", refreshToken, { maxAge: 3600 * 1000, httpOnly: true }).json({ message: "OK", token: accessToken, role: user.role });
            }
            else {
                res.send("INVALID PASSWORD")
            }
        } catch (error) {
            console.error(error)
            res.send("ERROR: SOMETHING BAD HAPPENED")
        }
    },
    signUp: async (req, res) => {
        try {
            const user = {
                username: "Ryan@admin",
                name: "Ryan Ali",
                password: "Ryan091138",
                role: "Admin"
            }
            user.password = await bcrypt.hash(user.password, 10);
            const database = await dbUtils.connectToDB();
            database.collection("users").insertOne(users)
            res.send("OK")

        } catch (error) {
            console.log(error)
            res.send("ERROR: SOMETHING BAD HAPPENED")
        }

    }
}