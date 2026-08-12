import { getDependency } from "../dependency.js";
import bcrypt from "bcrypt";

export class UserService {
    constructor() {
        this.userRepo = getDependency("userRepo");
    }

    async getList() {
        return await this.userRepo.find();
    }

    async getByUserName(userName) {
        return this.userRepo.findOne({ user_name: userName });
    }

    async add(user) {
        if (!user.user_name)
            throw new Error("El nombre de usuario es obligatorio");

        if (!user.password)
            throw new Error("La contraseña es obligatoria");
        
        const existentUser = await this.userRepo.find({
            user_name: user.user_name
        });
        if (existentUser.getList)
            throw new Error("El nombre de usuario ya existe");

        user.password = bcrypt.hashSync(user.password, 10);

        return this.userRepo.create(user);
    }

    async update(id, userData) {
        if (userData.password) {
            userData.password = bcrypt.hashSync(userData.password, 10);
        }

        return this.userRepo.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id) {
        return this.userRepo.findByIdAndDelete(id);
    }
}