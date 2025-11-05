import React from "react";

interface PlayerRowProps {
  name: string;
  score: number;
  onChange: (value: number) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ name, score, onChange }) => {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-lg font-medium text-gray-700">{name}</span>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 border rounded-md px-2 py-1 text-right"
      />
    </div>
  );
};

export default PlayerRow;
