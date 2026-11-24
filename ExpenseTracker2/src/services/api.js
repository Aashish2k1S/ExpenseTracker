const API_BASE = '/api/finance';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || `Request failed with status ${res.status}`;
      return { success: false, error: errorMsg, status: res.status, offline: data?.offline };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message, networkError: true };
  }
}

export const financeApi = {
  // Check health and MongoDB connection status
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return { online: false, dbConnected: false };
      const data = await res.json();
      return {
        online: true,
        dbConnected: data.database === 'connected',
        hasMongoUri: data.hasMongoUri,
        message: data.message,
      };
    } catch {
      return { online: false, dbConnected: false };
    }
  },

  // Fetch full state from MongoDB
  async getState() {
    return await fetchJSON(API_BASE);
  },

  // Record a transaction
  async addTransaction(transaction) {
    return await fetchJSON(`${API_BASE}/transaction`, {
      method: 'POST',
      body: JSON.stringify({ transaction }),
    });
  },

  // Delete a transaction
  async deleteTransaction(id) {
    return await fetchJSON(`${API_BASE}/transaction/${id}`, {
      method: 'DELETE',
    });
  },

  // Update SBI operating balance
  async updateSbiBalance(sbiBalance) {
    return await fetchJSON(`${API_BASE}/sbi-balance`, {
      method: 'PUT',
      body: JSON.stringify({ sbiBalance }),
    });
  },

  // Update goals
  async updateGoals(goals) {
    return await fetchJSON(`${API_BASE}/goals`, {
      method: 'PUT',
      body: JSON.stringify({ goals }),
    });
  },

  // Update salary routine
  async updateSalaryRoutine({ month, checklist, routineData }) {
    return await fetchJSON(`${API_BASE}/salary-routine`, {
      method: 'PUT',
      body: JSON.stringify({ month, checklist, routineData }),
    });
  },

  // Full state sync (import/restore/backup)
  async syncFullState(state) {
    return await fetchJSON(`${API_BASE}/sync`, {
      method: 'POST',
      body: JSON.stringify(state),
    });
  },

  // Reset to default
  async resetState() {
    return await fetchJSON(`${API_BASE}/reset`, {
      method: 'POST',
    });
  },
};
