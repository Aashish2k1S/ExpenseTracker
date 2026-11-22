import { useState } from 'react';
import { X } from 'lucide-react';

export default function EditGoalModal({ goal, onClose, onSave }) {
  const [draft, setDraft] = useState({ ...goal });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#f5f5f5]">Edit {draft.name}</h3>
          <button type="button" onClick={onClose} className="text-[#a3a3a3] hover:text-[#f5f5f5]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Current Saved Balance (₹)</label>
            <input
              type="number"
              min="0"
              value={draft.saved}
              onChange={(e) => setDraft({ ...draft, saved: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Target Amount (₹)</label>
            <input
              type="number"
              min="1"
              value={draft.target}
              onChange={(e) => setDraft({ ...draft, target: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Monthly Contribution (₹)</label>
            <input
              type="number"
              min="0"
              value={draft.monthlyContribution}
              onChange={(e) => setDraft({ ...draft, monthlyContribution: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-medium text-[#f5f5f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#10b981] text-[#0a0a0a] text-xs font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
