import { Button } from "@/shared/ui/button";
import { useTimescaleStore } from "@/widgets/chart-with-timescale/model/store";
import { TimescaleOption } from "@/widgets/chart-with-timescale/model/types";
import { Ellipsis } from "lucide-react";

const options: TimescaleOption[] = ["1D", "7D", "1M", "1Y", "All"];

// Маппинг на количество дней для CoinGecko API
export const timescaleToApiDays: Record<TimescaleOption, string> = {
  "1D": "1",
  "7D": "7",
  "1M": "30",
  "1Y": "365",
  All: "max",
};

interface TimescaleSelectorProps {
  onTimescaleChange?: (days: string) => void;
}

const TimescaleSelector = ({ onTimescaleChange }: TimescaleSelectorProps) => {
  const { selected, setSelected } = useTimescaleStore();

  const handleSelect = (option: TimescaleOption) => {
    setSelected(option);
    const days = timescaleToApiDays[option];
    onTimescaleChange?.(days);
  };

  return (
    <div className="grid grid-cols-7 bg-zinc-800 mt-4 rounded-lg p-1">
      {options.map((option) => (
        <Button
          key={option}
          variant={selected === option ? "outline" : "ghost"}
          size="sm"
          className="text-xs"
          onClick={() => handleSelect(option)}
        >
          {option}
        </Button>
      ))}
      <Button variant={"ghost"} size="sm" className="text-xs">
        Log
      </Button>
      <Button variant={"ghost"} size="sm" className="w-full">
        <Ellipsis className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TimescaleSelector;
