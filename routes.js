const express = require("express");

const router = express.Router();

const dbo = require('./connect')

router.route("/login").post(async function (req, res) {
    const dbConnect = dbo.getDb();

    let user = await dbConnect.collection("userData").findOne({ userName: req.body.userName, password: req.body.password })
    console.log(user);
    if (user) {
        res.status(200).send("Log in successful")
    } else {
        res.status(400).send("Log in failed")
    }
});

router.route("/generate").post(async function (req, res) {

    const urlS = req.body.urlSent
    console.log(urlS)

    const dbConnect = dbo.getDb();

    let check = await dbConnect.collection("urlData").findOne({ url: urlS })
    if (check) {
        res.status(200).json(check)
    } else {
        let urlBin = ""
        for (var i = 0; i < urlS.length; i++) {
            urlBin += urlS[i].charCodeAt(0).toString(2)
        }
        console.log(urlBin)
        const code = parseInt(urlBin,2)
        const codeHex = code.toString(16)
        console.log(code)
        console.log(codeHex.slice(6))
        res.status(200).send(urlBin);
    }
});

module.exports = router;