import { PositionMetrics } from "@/components/PositionMetrics/PositionMetrics";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Page({
  params,
}: {
  params: Promise<{ hiring_id: string; lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <PositionMetrics dictionary={dictionary} />;
}
