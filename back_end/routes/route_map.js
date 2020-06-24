const router = require('express').Router();
let db = require('../models');

router.route('/allData').get((req, res) => {
    db.mapDB.find()
        .then(allMap => {
            res.json(allMap);
        })
        .catch(err => {

        });
});

module.exports = router;