import { User } from './user.model';
import { AuthData } from './auth-data.model';

export class AuthService {
  private user: User;

  constructor() {}

  register(user: AuthData) {
    this.user = {
      email: user.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
  }

  login(user: AuthData) {
    this.user = {
      email: user.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
  }

  logout() {
    this.user = null;
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }
}
