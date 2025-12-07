export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  subscriptionID: string;
  socialSecurityNumber: string;
  email: string;
  password: string;
  phoneNr: string;
}
