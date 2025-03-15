import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";

type UnitConversions = {
  [key: string]: { [key: string]: number };
};

const unitConversions: UnitConversions = {
  kg: { g: 1000, lb: 2.20462, oz: 35.274 },
  g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
  lb: { kg: 0.453592, g: 453.592, oz: 16 },
  oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625 },
  li: { ml: 1000 },
  ml: { li: 0.001 },
  pc: {},
};

interface UnitConverterProps {
  showConverter: boolean;
  setShowConverter: (open: boolean) => void;
}

export default function UnitConverter({ showConverter, setShowConverter }: UnitConverterProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>("kg");

  return (
    <Dialog open={showConverter} onOpenChange={setShowConverter}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unit Conversion</DialogTitle>
          <DialogDescription>Select a unit to see conversions:</DialogDescription>
        </DialogHeader>

        {/* Unit Selector Dropdown */}
        <div className="p-4">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(unitConversions).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conversion Table */}
        <div className="p-4 space-y-2">
          {unitConversions[selectedUnit] && Object.keys(unitConversions[selectedUnit]).length > 0 ? (
            Object.entries(unitConversions[selectedUnit]).map(([unit, value]) => (
              <div key={unit} className="flex justify-between text-sm border-b py-1">
                <span>1 {selectedUnit.toUpperCase()}</span>
                <span>= {value} {unit.toUpperCase()}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No conversions available for this unit.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
