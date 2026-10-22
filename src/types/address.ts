export interface Address {
  id: string;
  fullName: string;
  mobileNumber: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}
