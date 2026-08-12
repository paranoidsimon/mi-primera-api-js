import { getDependency } from "../dependency.js";

export class SessionService {
    constructor() {
        this.sessionRepo = getDependency("sessionRepo");
    }

    async getByToken(token) {
        return await this.sessionRepo.findOne({ authorizationToken: token });
    }

    async deleteByToken(token) {
        if (!token) {
            return null;
        }

        return await this.sessionRepo.deleteOne({ authorizationToken: token });
    }
}