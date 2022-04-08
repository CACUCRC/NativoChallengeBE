const express = require("express");

const router = express.Router();

const dbo = require('./connect')

router.route("/login").post(async function (req, res) {
    const dbConnect = dbo.getDb();

    let user = await dbConnect.collection("userData").findOne({ userName: req.body.userName, password: req.body.password })
    if (user) {
        res.status(200).send("Log in successful")
    } else {
        res.status(400).send("Log in failed")
    }
});

router.route("/generate").post(async function (req, res) {

    const url = req.body.urlent

    const dbConnect = dbo.getDb();

    let check = await dbConnect.collection("urlData").findOne({ url: url })
    if (check) {
        console.log("Found already existing")
        res.status(200).json(check)
    } else {
        let code = 0
        for (var i = 0; i < url.length; i++) {
            code += parseInt(url[i].charCodeAt(0).toString(10), 10)
        }
        const newEntry = {
            ulr: url,
            visits: 0,
            code: code
        }
        await dbConnect.collection("urlData").insertOne(newEntry)
        console.log("Inserted new one")
        res.status(200).json(newEntry);
    }
});

module.exports = router;