const express = require("express");

const router = express.Router();

const dbo = require('./connect')

router.route("/login").post(async function (req, res) {
    const dbConnect = dbo.getDb();

    let user = await dbConnect.collection("userData").findOne({ userName: req.body.userName, password: req.body.password })
    if (user) {
        console.log("Log in successful")
        res.status(200).send("Log in successful")
    } else {
        console.log("Log in failed")
        res.status(400).send("Log in failed")
    }
});

router.route("/generate").post(async function (req, res) {

    const url = req.body.urlSent

    const dbConnect = dbo.getDb();

    let check = await dbConnect.collection("urlData").findOne({ url: url })
    if (check) {
        const listingQuery = { url: url };
        const updates = {
            $inc: {
                requests: 1,
            },
        };
        let update = await dbConnect.collection("urlData").updateOne(listingQuery, updates)
        if (update) {
            console.log("Found already existing")
            res.status(200).json(check)
        } else {
            console.log("Could not update found")
            res.status(400).send("Could not update found")
        }
    } else {
        let code = 0
        for (var i = 0; i < url.length; i++) {
            code += parseInt(url[i].charCodeAt(0).toString(10), 10)
        }
        const newEntry = {
            url: url,
            visits: 0,
            requests: 1,
            code: code
        }
        let insert = await dbConnect.collection("urlData").insertOne(newEntry)
        if (insert) {
            console.log("Inserted new one")
            res.status(200).json(newEntry);
        } else {
            console.log("Could not insert new one")
            res.status(400).send("Could not insert new one")
        }

    }
});

router.route("/top20").get(async function (req, res) {
    const dbConnect = dbo.getDb();
    let data = await dbConnect.collection("urlData").find({}).sort({ visits: -1 }).limit(20).toArray()
    if (data) {
        console.log("Loaded top 20 most visited")
        res.status(200).json({ results: data })
    } else {
        console.log("Error loading top 20")
        res.status(400).send("Error fetching top 20")
    }
});

router.route("/goto").post(async function (req, res) {
    const dbConnect = dbo.getDb();
    const code = parseInt(req.body.code)
    let page = await dbConnect.collection("urlData").findOne({ code: code })
    if (page) {
        const listingQuery = { code: code };
        const updates = {
            $inc: {
                visits: 1,
            },
        };
        let update = await dbConnect.collection("urlData").updateOne(listingQuery, updates)
        if (update) {
            console.log("Found page from code")
            res.status(200).json(page)
        }else{
            console.log("Could not update visits for page")
            res.status(400).send("Visits for the page could not be updated")
        }

    } else {
        console.log("Could not fin page from code")
        res.status(400).send("Code does not match any url")
    }
})

module.exports = router;