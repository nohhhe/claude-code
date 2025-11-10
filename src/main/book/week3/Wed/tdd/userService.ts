import bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  password: string;
}

interface RegisterResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  error?: string;
}

export class UserService {
  private users: User[] = [];

  async registerUser(userData: { email: string; password: string }): Promise<RegisterResult> {
    // 중복 체크
    if (this.users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' };
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 사용자 생성
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      password: hashedPassword
    };

    this.users.push(newUser);

    return {
      success: true,
      user: { id: newUser.id, email: newUser.email }
    };
  }
}