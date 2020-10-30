/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection } from "./Connection";
import mysql from 'mysql';
import { Model } from "./model"

const conn : Connection = new Connection(mysql);
const model: Model = new Model();

const connection = conn.db.createConnection(conn.connectionConfig);

function createTable(conn : any) {
 
    const sql = `CREATE TABLE IF NOT EXISTS ${model.name} (\n`+
                "ID int NOT NULL AUTO_INCREMENT,\n"+
                `${model.first_field} varchar(150) NOT NULL,\n`+
                `${model.second_field} varchar(150) NOT NULL,\n`+
                "PRIMARY KEY (ID));";
      
    conn.query(
        sql, 
        function (error: any){
            if(error) 
                // eslint-disable-next-line no-undef
                return console.log(error);

            // eslint-disable-next-line no-undef
            console.log(`MySQL.js: Table ${model.name} created with success.`);
        }
    );
}

function addRows(conn : any){
    const sql = "INSERT INTO Usuarios(Nome, email) VALUES ?";
    const values = [
          ['teste1', '12345678901@bla.com'],
          ['teste2', '09876543210@bla.com'],
          ['teste3', '12312312399@bla.com']
    ];

    conn.query(
        sql, 
        [values], 
        function (error: any){
            if(error) 
                // eslint-disable-next-line no-undef
                return console.log(error);

            // eslint-disable-next-line no-undef
            console.log('MySQL.js: Successfuly added the values.');
            conn.end();//fecha a conexão
        }
    );
}

connection.connect(
    function(err: any){
        if(err) 
            // eslint-disable-next-line no-undef
            return console.log(err);

        // eslint-disable-next-line no-undef
        console.log(`MySQL.js: Connected to the MySQL database: "${conn.connectionConfig.database}"`);
        createTable(connection);
        addRows(connection);
    }
)