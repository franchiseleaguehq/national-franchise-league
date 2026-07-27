import type { Metadata } from "next";

import { RulesRulebook } from "./rules-rulebook";

export const metadata: Metadata = {
  title: "League Rules | National Franchise League",
  description: "Official Madden PS5 franchise league rulebook for the National Franchise League.",
};

export default function RulesPage() {
  return <RulesRulebook />;
}
