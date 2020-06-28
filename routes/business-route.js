const express = require('express');

const app = express();
const businessRoutes = express.Router();

/* Require business models here */
let Business = require('../models/Business');

// Adding new data

businessRoutes.route('/add').post((req, res) => {
    let business = new Business(req.body);
    business.save().then(business => {
        res.status(200).json({ 'business': 'business is added successfully' });
    })
        .catch(err => {
            res.status(400).send('Unable to add  business to database')
        });
});

//Getting all stored data

businessRoutes.route('/').get((req, res) => {
    Business.find(function (err, business) {
        if (business) {
            res.json(business);
        } else {
            console.log(err);
        }
    });
});

// Editing the data 
businessRoutes.route('/edit/:id').get((req, res) => {
    let id = req.params.id;
    Business.findById(id, (err, business) => {
        res.json(business);
    });
});

businessRoutes.route('/editinfo/:id').get((req, res) => {
    let id = req.params.id;
    Business.findById(id, (err, business) => {
        res.json(business);
    });
});
// Updating the data

businessRoutes.route('/update/:id').post((req, res) => {
    Business.findById(req.params.id, (err, business) => {
        if (!business) {
            return next(new Error('Could not load the document'));
        } else {
            business.name = req.body.name;
            business.email = req.body.email;
            business.mobile_number = req.body.mobile_number;
            business.designation = req.body.designation;
            business.degree = req.body.degree;
            business.skills = req.body.skills;
            business.experience = req.body.experience;

            business.save().then(business => {
                res.json('Data Updated Successfully');
            })
                .catch(err => {
                    res.status(400).send('Unable to update the database');
                });
        }
    });
});

// Deleting the data

businessRoutes.route('/delete/:id').get((req, res) => {
    let id = req.params.id;
    Business.findByIdAndDelete(id, (err, business) => {
        if (err) {
            res.json(err)
        } else {
            res.json('Data Removed Successfully');
        }
    });
});

module.exports = businessRoutes;