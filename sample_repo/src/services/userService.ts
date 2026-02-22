interface User {
  id: number;
  name: string;
  email: string;
}

export class UserService {
  private users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async create(data: Omit<User, "id">): Promise<User> {
    const newUser: User = { id: this.users.length + 1, ...data };
    this.users.push(newUser);
    return newUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}