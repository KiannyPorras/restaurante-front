import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
}

export function TimeSelect({ value, onChange, required }: TimeSelectProps) {
  const parts = value ? value.split(":") : ["", ""];
  const hour = parts[0];
  const minute = parts[1];

  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i.toString().padStart(2, "0"));
  }
  const minutes: string[] = [];
  for (let i = 0; i < 60; i++) {
    minutes.push(i.toString().padStart(2, "0"));
  }

  return (
    <div className="flex h-9 w-full items-center gap-1 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
      <Clock className="mr-1 size-4 text-muted-foreground shrink-0" />
      <Select
        value={hour}
        onValueChange={(newHour) => onChange(`${newHour}:${minute || "00"}`)}
        required={required}
      >
        <SelectTrigger className="h-full border-0 px-1 py-0 shadow-none hover:bg-muted/50 focus:ring-0 [&>svg]:hidden">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {hours.map((h) => (
            <SelectItem key={`h-${h}`} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="font-medium text-muted-foreground">:</span>
      <Select
        value={minute}
        onValueChange={(newMinute) => onChange(`${hour || "00"}:${newMinute}`)}
        required={required}
      >
        <SelectTrigger className="h-full border-0 px-1 py-0 shadow-none hover:bg-muted/50 focus:ring-0 [&>svg]:hidden">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {minutes.map((m) => (
            <SelectItem key={`m-${m}`} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
