const express = require("express");

const router = express.Router();

const dbo = require('./connect')

router.route("/login").post(async function (req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("userData")
        .findOne({ userName: req.body.userName, password: req.body.password }, function (err, result) {
            if (err) {
                res.status(400).send("Log in failed");
            } else {
                res.status(200).send("Log in successful")
            }
        });
});

router.route("/login").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("userData")
        .find({})
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.status(200).json(result);
            }
        });
});

module.exports = router;