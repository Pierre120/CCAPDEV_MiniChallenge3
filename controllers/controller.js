const db = require('../models/db.js');
const Transaction = require('../models/TransactionModel.js');

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `index.hbs` with all
            transactions currently stored in the database.
    */
    getIndex: function(req, res) {
        // your code here
        // query to get all necessary documents
        let query = req.query;

        // fields to be returned
        let projection = 'name refno amount';

        // retrieve all the documents
        db.findMany(Transaction, query, projection, function(docs) {
            res.render('index', { transactions: docs }); // This is to load the page initially
        });
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getCheckRefNo`. This function checks if a
            specific reference number is stored in the database. If the number
            is stored in the database, it returns an object containing the
            reference number, otherwise, it returns an empty string.
    */
    getCheckRefNo: function(req, res) {
        // your code here
        //  Reference number
        let refno = req.query.refno;

        // find if `refno` already exists in the database
        db.findOne(Transaction, { refno: refno }, 'refno', function(result) {
            res.send(result);
        });
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getAdd`. This function adds the transaction
            sent by the client to the database, then appends the new
            transaction to the list of transactions in `index.hbs`.
    */
    getAdd: function(req, res) {
        // your code here
        // create transaction document object
        let trans = {
            name: req.query.name,
            refno: req.query.refno,
            amount: req.query.amount
        }

        db.insertOne(Transaction, trans, function(flag) {
            // Check if inserting of new document is successful
            if(flag) {
                res.render('partials/card', {
                    name: trans.name,
                    refno: trans.refno,
                    amount: trans.amount
                }, function (err, html) {
                    if(err) {
                        console.log(err);
                        res.send('');
                    } else {
                        console.log(html);
                        res.send(html);
                    }
                });
            }
        });
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getDelete`. This function deletes the transaction
            from the database, then removes the transaction from the list of
            transactions in `index.hbs`.
    */
    getDelete: function (req, res) {
        // your code here
        //  Reference number
        let refno = req.query.refno;

        // Delete one document
        db.deleteOne(Transaction, { refno: refno }, function(isSuccess) {
            res.send(isSuccess); // send if deleting of document is a success
        });
    }

}

module.exports = controller;
