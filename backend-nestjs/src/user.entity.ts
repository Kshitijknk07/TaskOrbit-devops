export class User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: string; // e.g., 'user', 'admin'
}
