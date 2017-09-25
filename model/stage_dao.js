const async = require('async');
const db = require('./../config/database')();

var StageDAO = function() {
    let sql;
    let conditions;
    return {
        // 会員登録

        // 予約
        registerStage: function(conn, req_body, last_callback) {
                sql;
                conditions;

                async.waterfall([
                    function(callback) {
                        // 会員登録
                        sql = "INSERT INTO users (??) VALUES (?)";
                        conditions = ['name', req_body.user_name];
                        conn.query({
                            sql: sql,
                            timeout: 40000,
                            values: conditions
                        }, function(error, results, fields) {
                            callback(error, results);
                        });
                    },
                    function(results, callback) {
                        // 予約登録
                        sql = "INSERT INTO stage_reservation (??, ??) VALUES (?, ?)";
                        conditions = ['user_id', 'memo', results.insertId, req_body.text];

                        conn.query({
                            sql: sql,
                            values: conditions
                        }, function(error, results, fields) {
                            callback(error, results);
                        });
                    }
                ], function(error, results) {
                        // conn.rollback(conn, error);
                    last_callback(error);
                });
        },
        delete : function(conn, user_id, callback){
            sql = "DELETE a, b FROM users a JOIN stage_reservation b ON a.id = b.user_id WHERE ?? = ?";
            conditions = ["a.id", user_id ];

            db.sqlQuery(conn, sql, conditions, function(results){
                callback();
            });
        }
    }
}

module.exports = StageDAO;
