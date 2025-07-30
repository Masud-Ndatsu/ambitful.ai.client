export interface Country {
  value: string;
  label: string;
  code: string;
}

export const countries: Country[] = [
  { value: "US", label: "United States", code: "US" },
  { value: "CA", label: "Canada", code: "CA" },
  { value: "UK", label: "United Kingdom", code: "GB" },
  { value: "AU", label: "Australia", code: "AU" },
  { value: "DE", label: "Germany", code: "DE" },
  { value: "FR", label: "France", code: "FR" },
  { value: "IT", label: "Italy", code: "IT" },
  { value: "ES", label: "Spain", code: "ES" },
  { value: "NL", label: "Netherlands", code: "NL" },
  { value: "SE", label: "Sweden", code: "SE" },
  { value: "NO", label: "Norway", code: "NO" },
  { value: "DK", label: "Denmark", code: "DK" },
  { value: "FI", label: "Finland", code: "FI" },
  { value: "CH", label: "Switzerland", code: "CH" },
  { value: "AT", label: "Austria", code: "AT" },
  { value: "BE", label: "Belgium", code: "BE" },
  { value: "IE", label: "Ireland", code: "IE" },
  { value: "PT", label: "Portugal", code: "PT" },
  { value: "NZ", label: "New Zealand", code: "NZ" },
  { value: "SG", label: "Singapore", code: "SG" },
  { value: "HK", label: "Hong Kong", code: "HK" },
  { value: "JP", label: "Japan", code: "JP" },
  { value: "KR", label: "South Korea", code: "KR" },
  { value: "IN", label: "India", code: "IN" },
  { value: "BR", label: "Brazil", code: "BR" },
  { value: "MX", label: "Mexico", code: "MX" },
  { value: "AR", label: "Argentina", code: "AR" },
  { value: "CL", label: "Chile", code: "CL" },
  { value: "CO", label: "Colombia", code: "CO" },
  { value: "PE", label: "Peru", code: "PE" },
  { value: "ZA", label: "South Africa", code: "ZA" },
  { value: "EG", label: "Egypt", code: "EG" },
  { value: "NG", label: "Nigeria", code: "NG" },
  { value: "KE", label: "Kenya", code: "KE" },
  { value: "GH", label: "Ghana", code: "GH" },
  { value: "MA", label: "Morocco", code: "MA" },
  { value: "TN", label: "Tunisia", code: "TN" },
  { value: "IL", label: "Israel", code: "IL" },
  { value: "AE", label: "United Arab Emirates", code: "AE" },
  { value: "SA", label: "Saudi Arabia", code: "SA" },
  { value: "TR", label: "Turkey", code: "TR" },
  { value: "RU", label: "Russia", code: "RU" },
  { value: "PL", label: "Poland", code: "PL" },
  { value: "CZ", label: "Czech Republic", code: "CZ" },
  { value: "HU", label: "Hungary", code: "HU" },
  { value: "RO", label: "Romania", code: "RO" },
  { value: "BG", label: "Bulgaria", code: "BG" },
  { value: "HR", label: "Croatia", code: "HR" },
  { value: "SI", label: "Slovenia", code: "SI" },
  { value: "SK", label: "Slovakia", code: "SK" },
  { value: "LT", label: "Lithuania", code: "LT" },
  { value: "LV", label: "Latvia", code: "LV" },
  { value: "EE", label: "Estonia", code: "EE" },
  { value: "GR", label: "Greece", code: "GR" },
  { value: "CY", label: "Cyprus", code: "CY" },
  { value: "MT", label: "Malta", code: "MT" },
  { value: "LU", label: "Luxembourg", code: "LU" },
  { value: "IS", label: "Iceland", code: "IS" },
  { value: "CN", label: "China", code: "CN" },
  { value: "TH", label: "Thailand", code: "TH" },
  { value: "VN", label: "Vietnam", code: "VN" },
  { value: "MY", label: "Malaysia", code: "MY" },
  { value: "ID", label: "Indonesia", code: "ID" },
  { value: "PH", label: "Philippines", code: "PH" },
  { value: "TW", label: "Taiwan", code: "TW" },
].sort((a, b) => a.label.localeCompare(b.label));

// Helper functions
export const getCountryByValue = (value: string): Country | undefined => {
  return countries.find(country => country.value === value);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryNames = (): string[] => {
  return countries.map(country => country.label);
};

export const getCountryCodes = (): string[] => {
  return countries.map(country => country.code);
};