export class UserInformation {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  poBox: string;
  streetName: string;
  houseNumber: string;
  userName: string;

  constructor(userId: string) {
    this.id = userId;
  }
}
