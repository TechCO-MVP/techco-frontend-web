import { FC } from "react";

interface CountryLabelProps {
  label: string;
}
export const CountryLabel: FC<Readonly<CountryLabelProps>> = ({ label }) => {
  const renderLabel = () => {
    const [flag, ...name] = label.split(" ");
    return `${name.join(" ")} ${flag}`;
  };
  return (
    <div className="rounded-md bg-[#F4F4F5] px-[10px] py-[2px]">
      {renderLabel()}
    </div>
  );
};
