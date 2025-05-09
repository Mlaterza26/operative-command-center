
interface AlertRecord {
  lineItemId: string;
  orderId: string;
  client: string;
  alertedAt?: string;
  alertedTo?: string;
  alertedBy?: string;
  resolved?: boolean;
  resolvedAt?: string;
  ignored?: boolean;
  savedHash?: string;
}

// Get all local storage alerts as a map
export const getLocalStorageAlerts = (): Record<string, AlertRecord> => {
  try {
    const alerts = localStorage.getItem('financeAlerts');
    if (alerts) {
      return JSON.parse(alerts);
    }
  } catch (error) {
    console.error('Error reading alerts from localStorage', error);
  }
  return {};
};

// Save all alerts to localStorage
const saveAlertsToLocalStorage = (alerts: Record<string, AlertRecord>): void => {
  try {
    localStorage.setItem('financeAlerts', JSON.stringify(alerts));
  } catch (error) {
    console.error('Error saving alerts to localStorage', error);
  }
};

// Record a new alert or update an existing one
export const recordAlert = (data: AlertRecord): void => {
  const currentAlerts = getLocalStorageAlerts();
  currentAlerts[data.lineItemId] = {
    ...data,
    alertedAt: data.alertedAt || new Date().toISOString(),
    alertedBy: data.alertedBy || data.alertedTo || 'System',
    resolved: data.resolved || false,
  };
  saveAlertsToLocalStorage(currentAlerts);
};

// Mark an alert as resolved
export const resolveAlert = (lineItemId: string): void => {
  const currentAlerts = getLocalStorageAlerts();
  if (currentAlerts[lineItemId]) {
    currentAlerts[lineItemId] = {
      ...currentAlerts[lineItemId],
      resolved: true,
      resolvedAt: new Date().toISOString()
    };
    saveAlertsToLocalStorage(currentAlerts);
  }
};

// Mark multiple alerts as resolved
export const resolveAllAlerts = (lineItemIds: string[]): void => {
  const currentAlerts = getLocalStorageAlerts();
  const now = new Date().toISOString();
  
  lineItemIds.forEach(id => {
    if (currentAlerts[id]) {
      currentAlerts[id] = {
        ...currentAlerts[id],
        resolved: true,
        resolvedAt: now
      };
    }
  });
  
  saveAlertsToLocalStorage(currentAlerts);
};

// Get all alerts as an array for history view
export const getAllAlertHistory = (): Array<{
  lineItemId: string;
  orderId: string;
  client: string;
  alertedAt: string;
  alertedBy: string;
  resolved: boolean;
  resolvedAt?: string;
}> => {
  const alerts = getLocalStorageAlerts();
  return Object.values(alerts)
    .filter(alert => !alert.ignored && alert.alertedAt) // Only show actual alerts, not just ignored items
    .map(alert => ({
      lineItemId: alert.lineItemId,
      orderId: alert.orderId,
      client: alert.client,
      alertedAt: alert.alertedAt || new Date().toISOString(),
      alertedBy: alert.alertedBy || alert.alertedTo || 'System',
      resolved: alert.resolved || false,
      resolvedAt: alert.resolvedAt
    }))
    .sort((a, b) => new Date(b.alertedAt).getTime() - new Date(a.alertedAt).getTime());
};
