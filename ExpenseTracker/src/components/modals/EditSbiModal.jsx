import { useState } from 'react';

export default function EditSbiModal({ currentBalance, onClose, onSave }) {
  const [value, setValue] = useState(String(currentBalance));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <h3 className="text-base font-bold text-[#f5f5f5] mb-1">Adjust SBI Bank Balance</h3>
        <p className="text-xs text-[#a3a3a3] mb-4">
          Sync your actual SBI operating balance (kept separate from UBI goals & PPF).
        </p>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] outline-none mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#FD1C00] text-white text-xs font-semibold"
          >
            Update Balance
          </button>
        </div>
      </div>
    </div>
  );
}
