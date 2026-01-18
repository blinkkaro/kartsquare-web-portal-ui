// Location data for India
export interface LocationOption {
  value: string;
  label: string;
}

export interface StateData {
  value: string;
  label: string;
  cities: LocationOption[];
}

// Countries
export const COUNTRIES: LocationOption[] = [
  { value: "India", label: "India" },
  // Add more countries as needed
];

// States of India with their cities
export const INDIAN_STATES: StateData[] = [
  {
    value: "Rajasthan",
    label: "Rajasthan",
    cities: [
      { value: "Jaipur", label: "Jaipur" },
      { value: "Jodhpur", label: "Jodhpur" },
      { value: "Udaipur", label: "Udaipur" },
      { value: "Kota", label: "Kota" },
      { value: "Ajmer", label: "Ajmer" },
      { value: "Bikaner", label: "Bikaner" },
      { value: "Alwar", label: "Alwar" },
      { value: "Bharatpur", label: "Bharatpur" },
      { value: "Bhilwara", label: "Bhilwara" },
      { value: "Sikar", label: "Sikar" },
    ],
  },
  {
    value: "Maharashtra",
    label: "Maharashtra",
    cities: [
      { value: "Mumbai", label: "Mumbai" },
      { value: "Pune", label: "Pune" },
      { value: "Nagpur", label: "Nagpur" },
      { value: "Nashik", label: "Nashik" },
      { value: "Aurangabad", label: "Aurangabad" },
      { value: "Solapur", label: "Solapur" },
      { value: "Thane", label: "Thane" },
    ],
  },
  {
    value: "Delhi",
    label: "Delhi",
    cities: [
      { value: "New Delhi", label: "New Delhi" },
      { value: "Delhi", label: "Delhi" },
    ],
  },
];

// Default values
export const DEFAULT_COUNTRY = "India";
export const DEFAULT_STATE = "Rajasthan";
export const DEFAULT_CITY = "Jaipur";

// Helper function to get cities by state
export const getCitiesByState = (stateName: string): LocationOption[] => {
  const state = INDIAN_STATES.find((s) => s.value === stateName);
  return state?.cities || [];
};

// Helper function to get all states
export const getAllStates = (): LocationOption[] => {
  return INDIAN_STATES.map((state) => ({
    value: state.value,
    label: state.label,
  }));
};
