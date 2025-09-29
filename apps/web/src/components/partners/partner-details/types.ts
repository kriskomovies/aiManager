// Shared interface for partner details used across tab components
export interface PartnerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxNumber: string;
  registrationNumber: string;
  creditLimit?: number;
  paymentTerms?: number;
  website?: string;
  description?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  servicesProvided: string[];
  buildingsAccess: string[];
  createdAt: string;
  updatedAt: string;
}
