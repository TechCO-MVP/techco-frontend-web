import type { Country, CountryDialCode } from "@/types";
export const COUNTRIES: Country[] = [
  { label: "🇨🇴 Colombia", value: "colombia", code: "co" },
  { label: "🇵🇪 Peru", value: "peru", code: "pe" },
  { label: "🇲🇽 Mexico", value: "mexico", code: "mx" },
];

export const DIAL_CODES: CountryDialCode[] = [
  { label: "Colombia +57 🇨🇴", value: "+57" },
  { label: "Peru +51 🇵🇪", value: "+51" },
  { label: "Mexico +52 🇲🇽", value: "+52" },
];
