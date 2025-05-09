
interface AlertRecord {
  lineItemId: string;
  orderId: string;
  client: string;
  alertedAt?: string;
  alertedTo?: string;
  resolved?: boolean;
  resolvedAt?: string;
  ignored?: boolean;
  savedHash?: string;
}

interface AlertsStore {
  [lineItemId: string]: AlertRecord;
}

// Get alerts from localStorage
export const getLocalStorageAlerts = (): AlertsStore => {
  try {
    const alerts = localStorage.getItem("financeAlerts");
    return alerts ? JSON.parse(alerts) : {};
  } catch (e) {
    console.error("Error reading alerts from localStorage:", e);
    return {};
  }
};

// Record a new alert in localStorage
export const recordAlert = (record: AlertRecord): void => {
  try {
    const alerts = getLocalStorageAlerts();
    
    alerts[record.lineItemId] = {
      ...alerts[record.lineItemId], // Keep existing record data if it exists
      ...record, // Update with new data
      alertedAt: record.alertedAt || alerts[record.lineItemId]?.alertedAt || new Date().toISOString(),
    };
    
    localStorage.setItem("financeAlerts", JSON.stringify(alerts));
    
    // Also update alert history
    updateAlertHistory(record);
    
    // Update last data refresh timestamp
    updateLastDataRefresh();
  } catch (e) {
    console.error("Error saving alert to localStorage:", e);
  }
};

// Update the last data refresh timestamp
export const updateLastDataRefresh = (): void => {
  try {
    localStorage.setItem("lastDataRefresh", new Date().toISOString());
  } catch (e) {
    console.error("Error updating last data refresh timestamp:", e);
  }
};

// Get the last data refresh timestamp
export const getLastDataRefresh = (): string => {
  try {
    const timestamp = localStorage.getItem("lastDataRefresh");
    if (timestamp) {
      return new Date(timestamp).toLocaleString();
    }
    return new Date().toLocaleString();
  } catch (e) {
    console.error("Error getting last data refresh timestamp:", e);
    return new Date().toLocaleString();
  }
};

// Update the alert history collection
export const updateAlertHistory = (record: AlertRecord): void => {
  try {
    let alertHistory = localStorage.getItem("alertHistory");
    let history = alertHistory ? JSON.parse(alertHistory) : [];
    
    // Add new record to history
    if (!record.resolved && !record.ignored) {
      const historyRecord = {
        lineItemId: record.lineItemId,
        orderId: record.orderId,
        client: record.client,
        alertedAt: record.alertedAt || new Date().toISOString(),
        alertedBy: "Current User",
        alertedTo: record.alertedTo || "Team",
        status: "Attention Requested",
        resolved: false
      };
      
      // Check if this line item is already in the history
      const existingIndex = history.findIndex((item: any) => 
        item.lineItemId === record.lineItemId
      );
      
      if (existingIndex >= 0) {
        history[existingIndex] = {...history[existingIndex], ...historyRecord};
      } else {
        history.push(historyRecord);
      }
    }
    // Update resolved status
    else if (record.resolved) {
      history = history.map((item: any) => {
        if (item.lineItemId === record.lineItemId) {
          return {
            ...item,
            resolved: true,
            resolvedAt: record.resolvedAt || new Date().toISOString(),
            status: "Resolved"
          };
        }
        return item;
      });
    }
    // Update ignored/reviewed status
    else if (record.ignored) {
      history = history.map((item: any) => {
        if (item.lineItemId === record.lineItemId) {
          return {
            ...item,
            reviewed: true,
            reviewedAt: new Date().toISOString(),
            status: "Reviewed"
          };
        }
        return item;
      });
    }
    
    localStorage.setItem("alertHistory", JSON.stringify(history));
  } catch (e) {
    console.error("Error updating alert history:", e);
  }
};

// Get alert history from localStorage
export const getAlertHistory = (): any[] => {
  try {
    const alertHistory = localStorage.getItem("alertHistory");
    return alertHistory ? JSON.parse(alertHistory) : [];
  } catch (e) {
    console.error("Error reading alert history from localStorage:", e);
    return [];
  }
};

// Clear alert for a specific line item
export const clearAlert = (lineItemId: string): void => {
  try {
    const alerts = getLocalStorageAlerts();
    if (alerts[lineItemId]) {
      delete alerts[lineItemId];
      localStorage.setItem("financeAlerts", JSON.stringify(alerts));
    }
  } catch (e) {
    console.error("Error clearing alert from localStorage:", e);
  }
};

// Clear all alert history
export const clearAlertHistory = (): void => {
  try {
    localStorage.removeItem("alertHistory");
  } catch (e) {
    console.error("Error clearing alert history:", e);
  }
};
