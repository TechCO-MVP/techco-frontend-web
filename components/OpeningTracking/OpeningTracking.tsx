import { Dictionary } from "@/types/i18n";
import { Board } from "../Board/Board";
import { FC } from "react";

type OpeningTrackingProps = {
  dictionary: Dictionary;
};
export const OpeningTracking: FC<Readonly<OpeningTrackingProps>> = ({
  dictionary,
}) => {
  return <Board dictionary={dictionary} />;
};
