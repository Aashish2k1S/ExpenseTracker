export default function ResetModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#FD1C00]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-base font-bold text-[#f5f5f5] mb-2">
          Reset to November 2026 Defaults?
        </h3>
        <p className="text-xs text-[#a3a3a3] leading-relaxed mb-5">
          This will restore SBI balance to ₹1,032, PPF to ₹1,000, UBI goal buckets to ₹0, and clear
          all logged transactions. Consider exporting a JSON backup first.
        </p>
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
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#FD1C00] hover:bg-[#e01800] text-white text-xs font-semibold"
          >
            Reset Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
