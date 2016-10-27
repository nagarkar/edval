export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
}
export interface StaffMap {[s: string]: Staff};
