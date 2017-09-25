'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const settings = require('./config/settings');
var domain = require('express-domain-middleware');



// DBオブジェクト読み込み
const db = require('./config/database')();
let conn = db.conn();

// controller読み込み
const stage = require('./controller/stage.js')();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(domain);


// 使用状況を保存する
app.post('/', function(req, res) {
    let req_body = req.body;
    let req_id = req_body.user_id;
    let name = req_body.user_name;
    let text = req_body.text;

    // 会員登録されているか確認する


    // 現在利用中華確認する
    let sql = "SELECT user_id, name, memo, DATE_FORMAT(create_at, '%Y/%m/%d %H:%i') as date" +
        " FROM stage_reservation JOIN users ON users.id = stage_reservation.user_id" +
        " WHERE ?? = ?";
    let conditions = ['name', name];

    db.sqlQuery(conn, sql, conditions, function(results) {

        // レスポンスするデータを格納する
        let res_data = {};

        let promise = new Promise(function(resolve, reject) {

            if (Object.keys(results).length === 0) {
                console.log("not used");

                stage.notUsed(req_body, function(data) {
                    res_data = data;
                    resolve();
                });
            } else {
                // 同じ人が/stageを使った場合
                if (results[0].name == name) {

                    stage.used(req_id, function(data) {
                        res_data = data;
                        resolve();
                    });

                } else {
                    console.log("already used");
                    data = {
                        "response_type": "in_channel",
                        "text": results[0].name + "さんが利用しています。",
                        "attachments": [{
                            "pretext": results[0].text
                        }]
                    };
                    resolve();
                }
            }
        });

        promise.then(function() {
            res.json(res_data);
            // res.json(res_data);
        });

        process.on('unhandledRejection', console.dir);

        promise.catch(function(err){
            console.log("index.js");
            res.json({
                "response_type": "in_channel",
                "text": err.message
            });
        });

    });

});



const server = app.listen(1234, function() {
    console.log("server running...");
});
