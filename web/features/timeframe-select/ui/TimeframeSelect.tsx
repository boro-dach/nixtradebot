import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

const TIMEFRAMES = ["1m", "30m", "1h", "4h", "1d"];

interface TimeframeSelectProps {
  defaultValue?: string;
  onSelectTimeframe: (timeframe: string) => void;
}

export const TimeframeSelect: React.FC<TimeframeSelectProps> = ({
  defaultValue = "1h",
  onSelectTimeframe,
}) => {
  return (
    <ToggleGroup
      type="single"
      defaultValue={defaultValue}
      variant="outline"
      className="w-full justify-start"
      onValueChange={(value) => {
        if (value) onSelectTimeframe(value);
      }}
    >
      {TIMEFRAMES.map((tf) => (
        <ToggleGroupItem key={tf} value={tf}>
          {tf}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
