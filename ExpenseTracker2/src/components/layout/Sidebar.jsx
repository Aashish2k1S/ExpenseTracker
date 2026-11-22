import { Download, Upload } from 'lucide-react';
import { NAV_ITEMS } from './navItems';
import { formatINR } from '../../utils/formatters';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sbiBalance,
  totalTrackedSavings,
  onExport,
  onImportClick,
}) {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-[#262626] bg-[#0a0a0a] p-5 sticky top-0 h-screen justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#FD1C00] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#FD1C00]/25">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#f5f5f5] leading-tight">
              Aashish's Finance
            </h1>
            <p className="text-[11px] text-[#a3a3a3]">Personal Dashboard</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#1c1c1c] text-[#f5f5f5] border border-[#262626] shadow-sm'
                    : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#141414]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FD1C00]' : ''}`} />
                <span>{item.fullLabel || item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a3a3a3]">SBI Operating</span>
          <span className="font-semibold text-[#f5f5f5]">{formatINR(sbiBalance)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a3a3a3]">Tracked Savings</span>
          <span className="font-semibold text-[#10b981]">{formatINR(totalTrackedSavings)}</span>
        </div>
        <div className="pt-2 border-t border-[#262626] flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={onExport}
            className="flex-1 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-[11px] text-[#a3a3a3] hover:text-[#f5f5f5] flex items-center justify-center gap-1"
            title="Export JSON"
          >
            <Download className="w-3 h-3" /> Export
          </button>
          <button
            type="button"
            onClick={onImportClick}
            className="flex-1 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-[11px] text-[#a3a3a3] hover:text-[#f5f5f5] flex items-center justify-center gap-1"
            title="Import JSON"
          >
            <Upload className="w-3 h-3" /> Import
          </button>
        </div>
      </div>
    </aside>
  );
}
