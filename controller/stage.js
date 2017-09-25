const stage_dao = require('../model/stage_dao.js')();
const db = require('./../config/database')();
let conn = db.conn();

// /stageコマンド処理
var Stage = function() {
    let data = {};

    return {
        used: function(user_id, callback) {

            let promise = new Promise(function(resolve, reject) {

                conn.beginTransaction(function(err) {
                    if (err) {
                        reject();
                    }
                    stage_dao.delete(conn, user_id, function() {
                        this.data = {
                            "response_type": "in_channel",
                            "text": "ステージの利用終了しました"
                        }
                        resolve();
                    });
                });

            });

            promise.then(function() {
                console.log("stage.js");
                conn.commit(conn);
                callback(this.data);
            });

            promise.catch(function(err) {
                data = {
                    "response_type": "in_channel",
                    "text": err.message
                };
                conn.rollback(conn, err);
                callback(data);
            });
        },
        notUsed: function(req_body, callback) {
            // ユーザー登録
            conn.beginTransaction(function(err) {
                stage_dao.registerStage(conn, req_body, function(err) {
                    try {
                        conn.commit(conn);
                        console.log(11111);
                        // 予約
                        data = {
                            "response_type": "in_channel",
                            "text": "ステージの利用開始します"
                        };
                        callback(data);
                    } catch (e) {
                        console.log(222222);
                        conn.rollback(conn, err);
                        data = {
                            "response_type": "in_channel",
                            "text": e.message
                        };
                        callback(data);
                    }
                });
            });
        }
    }
}

module.exports = Stage;
