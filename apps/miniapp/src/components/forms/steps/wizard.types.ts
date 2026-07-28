export interface WizardFormData {
  firstName: string;
  lastName: string;
  age: string;
  phone: string;
  telegramUsername: string;
  categoryId: string;
  regionId: string;
  districtId: string;
  villageId: string;
  address: string;
  latitude: string;
  longitude: string;
  description: string;
  experienceYears: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  images: File[];
  acceptedTerms: boolean;
}

export const INITIAL_WIZARD_DATA: WizardFormData = {
  firstName: "",
  lastName: "",
  age: "",
  phone: "",
  telegramUsername: "",
  categoryId: "",
  regionId: "",
  districtId: "",
  villageId: "",
  address: "",
  latitude: "",
  longitude: "",
  description: "",
  experienceYears: "",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  images: [],
  acceptedTerms: false
};

export type WizardFieldUpdater = <K extends keyof WizardFormData>(
  field: K,
  value: WizardFormData[K]
) => void;
