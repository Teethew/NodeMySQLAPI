/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class Connection {

    public db;
    public connectionConfig = {
        host     : 'localhost',
        port     : 3306,
        user     : 'root',
        password : 'root',
        database : 'db_node'
    };

    constructor(db: any){
        this.db = db;
    }
} 
    