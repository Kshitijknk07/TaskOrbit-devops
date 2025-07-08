export class User {
  [key: string]: unknown;
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: string; // e.g., 'user', 'admin'
}
