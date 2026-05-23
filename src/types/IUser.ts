/**
 * @description IUser yang mewakili profil pengguna terdaftar.
 */
export interface IUser {
  id: string;
  email: string;
  name: string;
  address: string;
  phoneNumber: string;
  role: "user" | "admin";
  createdAt: string;
}
