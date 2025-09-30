import { Button } from "@/shared/ui/button";
import { TimescaleOption } from "../model/types";
import { useTimescaleStore } from "../model/store";
import { Ellipsis } from "lucide-react";

const options: TimescaleOption[] = ["1D", "7D", "1M", "1Y", "All"];

const TimescaleSelector = () => {
  const { selected, setSelected } = useTimescaleStore();

  return (
    <div className="grid grid-cols-7 bg-zinc-800 mt-4 rounded-lg p-1">
      {options.map((option) => (
        <Button
          key={option}
          variant={selected === option ? "outline" : "ghost"}
          size="sm"
          className="text-xs"
          onClick={() => setSelected(option)}
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
