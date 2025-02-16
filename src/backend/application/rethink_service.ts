import { RethinkRepository } from '../infrastructure/rethinkdb_repository';

export class RethinkService {
    constructor(private rethinkRepo: RethinkRepository) { }

    async createUser(userData: any) {
        return this.rethinkRepo.createUser(userData);
    }
}