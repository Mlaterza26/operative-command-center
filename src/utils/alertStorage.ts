
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
      ...record,
      alertedAt: record.alertedAt || new Date().toISOString(),
      resolved: record.resolved || false,
    };
    
    localStorage.setItem("financeAlerts", JSON.stringify(alerts));
    
    // Also update alert history
    updateAlertHistory(record);
  } catch (e) {
    console.error("Error saving alert to localStorage:", e);
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
        resolved: false
      };
      
      // Check if this line item is already in the history
      const existingIndex = history.findIndex((item: any) => 
        item.lineItemId === record.lineItemId
      );
      
      if (existingIndex >= 0) {
        history[existingIndex] = historyRecord;
      } else {
        history.push(historyRecord);
      }
    }
    // Update resolved status
    else if (record.resolved || record.ignored) {
      history = history.map((item: any) => {
        if (item.lineItemId === record.lineItemId) {
          return {
            ...item,
            resolved: true,
            resolvedAt: new Date().toISOString()
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
