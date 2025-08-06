import { CandidateProfile } from "@/components/CandidateProfile/CandidateProfile";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Page({
  params,
}: {
  params: Promise<{ hiring_id: string; lang: Locale }>;
}) {
  const { hiring_id, lang } = await params;
  const dictionary = await getDictionary(lang);
  return <CandidateProfile hiringId={hiring_id} dictionary={dictionary} />;
}
