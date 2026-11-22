import { useState } from 'react';
import { X } from 'lucide-react';

export default function NewGoalModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [horizon, setHorizon] = useState('short');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('0');
  const [monthly, setMonthly] = useState('');
  const [account, setAccount] = useState('UBI');

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetNum = Number(target);
    const monthlyNum = Number(monthly) || 0;
    if (!name.trim() || !targetNum || targetNum <= 0) return;

    const estMonths = monthlyNum > 0 ? Math.ceil(targetNum / monthlyNum) : 0;
    const expectedTime =
      estMonths > 24 ? `${(estMonths / 12).toFixed(1)} years` : `${estMonths || 12} months`;

    onCreate({
      id: `goal_${Date.now()}`,
      name: name.trim(),
      horizon,
      saved: Math.max(0, Number(saved) || 0),
      target: targetNum,
      monthlyContribution: monthlyNum,
      account,
      expectedTime,
      milestoneTip:
        horizon === 'short'
          ? 'Stay consistent every salary cycle to hit your short-term milestone.'
          : 'Long-term wealth goal. Review allocation once short-term goals complete.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#f5f5f5]">Create Financial Goal</h3>
          <button type="button" onClick={onClose} className="text-[#a3a3a3] hover:text-[#f5f5f5]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Travel Fund, Bike Upgrade..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Horizon</label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              >
                <option value="short">Short-Term</option>
                <option value="long">Long-Term</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Account Bucket</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              >
                <option value="UBI">UBI (Virtual Bucket)</option>
                <option value="PPF">PPF</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Target (₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="50000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Monthly Saving (₹)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="2000"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#FD1C00] rounded-xl px-3 py-2 text-sm text-[#f5f5f5] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1">Starting Saved Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
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
              className="px-4 py-2 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-xs font-semibold"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
