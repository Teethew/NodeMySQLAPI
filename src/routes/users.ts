/* eslint-disable @typescript-eslint/no-explicit-any */
import  express from 'express'
import  mysql  from 'mysql'
import bodyParser from 'body-parser'
import { Connection } from '../Connection'
import { Model } from '../model'
import validationMiddleware from '../models/validation'
import { Response } from 'express-serve-static-core'

const app = express() //importando express
const port = 3001; //porta padrão
const router = express.Router(); //definindo as rotas

const conn = new Connection(mysql) //abrindo conexão com o mySql
const db = conn.connectionConfig.database; //passando as configs da conexão
const model : Model = new Model() //importando model da tabela

let log : string; //variável que será usada para guardar o log da última operação realizada

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//GET (/)
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor na porta especificada
app.listen(port);
// eslint-disable-next-line no-undef
console.log(`API started at http://localhost:${port}`);

//GET (/usuarios)
router.get(`/${model.name}`, (req, res) => {
    execSQLQuery(`SELECT * FROM ${model.name}`, res);
    log = (`SELECT * FROM ${db}.${model.name}`)
})

//GET por id (/usuarios/{id})
router.get(`/${model.name}/:id?`, (req, res) => {
    let filter = '';
    if (req.params.id)
        filter = ' WHERE ID=' + parseInt(req.params.id);
    execSQLQuery(`SELECT * FROM ${model.name}` + filter, res);
    log = (`SELECT * FROM ${db}.${model.name} WHERE ID= ${req.params.id}`)
})

//POST (/usuarios)
router.post(`/${model.name}`, validationMiddleware, (req, res) => {
    const nome = req.body.nome.substring(0, 150); //CASE-SENSITIVE
    const email = req.body.email.substring(0, 150); //CASE-SENSITIVE
    execSQLQuery(`INSERT INTO ${model.name}(${model.first_field}, ${model.second_field}) VALUES('${nome}','${email}')`, res);
    log = (`INSERT INTO ${db}.${model.name}(${model.first_field}, ${model.second_field}) VALUES('${nome}','${email}')`)
});

//PATCH (/usuarios/{id})
router.patch(`/${model.name}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const nome = req.body.nome.substring(0,150);
    const email = req.body.email.substring(0,150);
    execSQLQuery(`UPDATE Clientes SET Nome='${nome}', email='${email}' WHERE ID=${id}`, res);
})

//DELETE por id (/usuarios/{id})
router.delete(`/${model.name}/:id`, (req, res) => {
    execSQLQuery(`DELETE FROM ${model.name} WHERE ID=` + parseInt(req.params.id), res);
    log = (`DELETE FROM ${db}.${model.name} WHERE ID= ${req.params.id}`)
})

//executa query no mySQL 
function execSQLQuery(sqlQry: string, res: Response<any, number>) {
    const connection = conn.db.createConnection(conn.connectionConfig);

    connection.query(sqlQry,
        function (error: any, results: any) {
            if (error)
                res.json(error);
            else
                res.json(results);

            connection.end();
            // eslint-disable-next-line no-undef
            console.log(`MySQL.js: Successfully executed the query: '${log}'`);
        }
    );
}

