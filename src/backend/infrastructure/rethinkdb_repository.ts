import * as r from 'rethinkdb';
import { Connection } from 'rethinkdb';

export class RethinkRepository {
    private connection: Connection | undefined;

    constructor(private config: {
        host: string,
        port: number,
        db: string,
        table: string
    }) { }

    async connect() {
        this.connection = await r.connect({
            host: this.config.host,
            port: this.config.port,
            db: this.config.db
        });
    }

    async initialize() {
        const conn = await r.connect({ host: this.config.host, port: this.config.port });

        // Create database if not exists
        const dbList = await r.dbList().run(conn);
        if (!dbList.includes(this.config.db)) {
            await r.dbCreate(this.config.db).run(conn);
        }

        // Create table if not exists
        const tableList = await r.db(this.config.db).tableList().run(conn);
        if (!tableList.includes(this.config.table)) {
            await r.db(this.config.db).tableCreate(this.config.table).run(conn);
        }

        await conn.close();
    }

    async createUser(user: any) {
        return r.table(this.config.table)
            .insert(user)
            .run(this.connection!);
    }

    watchUsers(callback: (err: Error | null, change?: any) => void) {
        return r.table(this.config.table)
            .changes()
            .run(this.connection!)
            .then(cursor => {
                cursor.each((err, change) => callback(err, change));
            });
    }
}