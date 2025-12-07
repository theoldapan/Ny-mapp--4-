import Address from "../Address";
import ContactInfo from "./ContactInformation";

type Facility = {
  id: string;
  contactInformation: ContactInfo;
  address: Address;
  socialMediaLinks: string[];
  description: string;
  images: string[];
};

export default Facility;
