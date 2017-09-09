const mysql = require('mysql');
const settings = require('./settings');

// DBオブジェクト
var Database = function() {
    let connection;

    return {
        conn: function() {
            if (connection == undefined) {
                connection = mysql.createConnection({
                    host: settings.HOST,
                    user: settings.DB_USER,
                    password: settings.DB_PASSWORD,
                    database: settings.DB_NAME
                });
            }
            return connection;
        },
        commit: function(conn) {
            conn.commit(function(err) {
                if (err) {
                    console.log("rollback");
                    this.rollback(conn, err);
                }
            });
        },
        rollback: function(conn, err) {
            conn.rollback(function() {
                throw err;
            });
        },
        sqlQuery: function(conn, sql, conditions, callback) {
            conn.query({
                sql: sql,
                timeout: 40000,
                values: conditions
            }, function(err, results, fields) {
                console.log("database.js");
                if (err) throw err;
                callback(results);
            });
        }
    };

}

module.exports = Database;
