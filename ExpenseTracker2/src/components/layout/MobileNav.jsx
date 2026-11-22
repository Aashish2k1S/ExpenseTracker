import { NAV_ITEMS } from './navItems';

export default function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-[#262626] px-2 py-1.5 flex items-center justify-around">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              active ? 'text-[#FD1C00]' : 'text-[#a3a3a3]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
