
 interface User {
  bio: any;
  blog_count: number;
  cover_image: string;
  created_at: string;
  email: string;
  full_name: any;
  id: number;
  location: any;
  profile_image: string;
  role: any;
  updated_at: string;
  username: string;
  website: any;


}
interface AuthResponseLogin {
  // token: string;
  // user: User;

  message: string;
  success: boolean;
  token: string;
  user: User;
  errors: string[]; //added on 27th june 2026
}

 interface AuthResponseRegister {
  success: boolean;
  // message: string;
  message: string;
  token: string;
  // user: User
  user: User;
  error: string;
  // token: string;
  errors: string[]; //added on 27th june 2026
}

export type { User, AuthResponseLogin, AuthResponseRegister };