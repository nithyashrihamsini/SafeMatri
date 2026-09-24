// Shared list of symptoms shown in the form. Weights feed the mock risk score.
export const SYMPTOMS = [
  { id: "fits", label: "Fits or convulsions", weight: 5, danger: true },
  { id: "bleeding", label: "Vaginal bleeding", weight: 4, danger: true },
  { id: "headache", label: "Severe headache", weight: 3 },
  { id: "vision", label: "Blurred vision", weight: 3 },
  { id: "movement", label: "Baby moving less than usual", weight: 3 },
  { id: "pain", label: "Severe stomach pain", weight: 3 },
  { id: "breath", label: "Difficulty breathing", weight: 3 },
  { id: "swelling", label: "Swelling of face or hands", weight: 2 },
  { id: "fever", label: "Fever", weight: 2 },
  { id: "vomiting", label: "Constant vomiting", weight: 2 },
];