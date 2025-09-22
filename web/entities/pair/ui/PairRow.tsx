import { Button } from "@/shared/ui/button";
import { ICryptoPair } from "../model/types";

interface PairRowProps {
  pair: ICryptoPair;
  onSelect: (pair: ICryptoPair) => void;
}

export const PairRow: React.FC<PairRowProps> = ({ pair, onSelect }) => (
  <Button
    variant="ghost"
    className="w-full justify-start gap-4 p-3 h-auto"
    onClick={() => onSelect(pair)}
  >
    {/* <pair.icon /> */}
    <span className="font-semibold text-base">{pair.name}</span>
  </Button>
);
