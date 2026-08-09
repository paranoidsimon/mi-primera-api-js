export class UserMockup {
    users = [
        { id: 1, name: "Simon", password: "1234"    },
        { id: 2, name: "Juan", password: "5678"      },
        { id: 3, name: "Pedro", password: "abcd"  }
    ];

    constructor() {
    }

    getList() {
        return this.users;
    }  

    add(user) {
        user.id = this.users
            .map(u => u.id)
            .reduce((a, b) => Math.max(a, b), 0) + 1;
        this.users.push(user);
        return user;
    }

    getByName(name) {
        return this.users.find(u => u.name === name);
    }
}