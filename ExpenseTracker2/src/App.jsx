import { useState, useRef } from 'react';
import { useFinanceStore } from './hooks/useFinanceStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import Toast from './components/layout/Toast';
import OverviewTab from './components/tabs/OverviewTab';
import TransactionsTab from './components/tabs/TransactionsTab';
import GoalsTab from './components/tabs/GoalsTab';
import AccountsTab from './components/tabs/AccountsTab';
import ReviewTab from './components/tabs/ReviewTab';
import EmergencyGuardrailModal from './components/modals/EmergencyGuardrailModal';
import SalaryConfirmModal from './components/modals/SalaryConfirmModal';
import EditGoalModal from './components/modals/EditGoalModal';
import NewGoalModal from './components/modals/NewGoalModal';
import EditSbiModal from './components/modals/EditSbiModal';
import ResetModal from './components/modals/ResetModal';

export default function App() {
  const store = useFinanceStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [emergencyModal, setEmergencyModal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [modals, setModals] = useState({
    salary: false,
    newGoal: false,
    sbi: false,
    reset: false,
  });

  const fileInputRef = useRef(null);

  const openModal = (key) => setModals((m) => ({ ...m, [key]: true }));
  const closeModal = (key) => setModals((m) => ({ ...m, [key]: false }));

  const handleTriggerEmergencyGuardrail = (txPayload, onSuccessReset) => {
    setEmergencyModal({ tx: txPayload, onSuccessReset });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans selection:bg-[#FD1C00]/30 selection:text-white pb-20 md:pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={store.handleImportJSON}
        className="hidden"
      />

      <Toast toast={store.toast} />

      <div className="max-w-360 mx-auto flex flex-col md:flex-row min-h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sbiBalance={store.state.sbiBalance}
          totalTrackedSavings={store.metrics.totalTrackedSavings}
          onExport={store.handleExportJSON}
          onImportClick={() => fileInputRef.current?.click()}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Header
            selectedMonth={store.selectedMonth}
            setSelectedMonth={store.setSelectedMonth}
            onResetClick={() => openModal('reset')}
            dbStatus={store.dbStatus}
            isSyncing={store.isSyncing}
            onReconnect={store.reconnectDB}
          />

          {activeTab === 'overview' && (
            <OverviewTab
              store={store}
              setActiveTab={setActiveTab}
              onEditSbi={() => openModal('sbi')}
              onEditGoal={setEditingGoal}
              onTriggerEmergencyGuardrail={handleTriggerEmergencyGuardrail}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab
              store={store}
              onTriggerEmergencyGuardrail={handleTriggerEmergencyGuardrail}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsTab
              store={store}
              onEditGoal={setEditingGoal}
              onNewGoal={() => openModal('newGoal')}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsTab
              store={store}
              onEditSbi={() => openModal('sbi')}
              onExecuteSalaryClick={() => openModal('salary')}
            />
          )}

          {activeTab === 'review' && (
            <ReviewTab
              store={store}
              onImportClick={() => fileInputRef.current?.click()}
              onResetClick={() => openModal('reset')}
            />
          )}
        </main>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {emergencyModal && (
        <EmergencyGuardrailModal
          tx={emergencyModal.tx}
          onClose={() => setEmergencyModal(null)}
          onConfirm={() => {
            store.commitTransaction(emergencyModal.tx);
            emergencyModal.onSuccessReset?.();
            setEmergencyModal(null);
          }}
        />
      )}

      {modals.salary && (
        <SalaryConfirmModal
          selectedMonth={store.selectedMonth}
          onClose={() => closeModal('salary')}
          onConfirm={() => {
            store.executeSalaryDayRoutine();
            closeModal('salary');
          }}
        />
      )}

      {editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
          onSave={store.updateGoal}
        />
      )}

      {modals.newGoal && (
        <NewGoalModal onClose={() => closeModal('newGoal')} onCreate={store.addGoal} />
      )}

      {modals.sbi && (
        <EditSbiModal
          currentBalance={store.state.sbiBalance}
          onClose={() => closeModal('sbi')}
          onSave={store.updateSbiBalance}
        />
      )}

      {modals.reset && (
        <ResetModal onClose={() => closeModal('reset')} onConfirm={store.handleResetDefaults} />
      )}
    </div>
  );
}
