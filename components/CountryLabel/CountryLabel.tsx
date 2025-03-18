import { FC } from "react";

interface CountryLabelProps {
  label: string | null;
  code?: string;
}
export const CountryLabel: FC<Readonly<CountryLabelProps>> = ({
  label,
  code,
}) => {
  const renderLabel = () => {
    if (!label) return null;
    const [flag, ...name] = label.split(" ");
    return `${code ? code : name.join(" ")} ${flag}`;
  };
  return (
    <div className="rounded-md bg-[#F4F4F5] px-[10px] py-[2px]">
      {renderLabel()}
    </div>
  );
};
