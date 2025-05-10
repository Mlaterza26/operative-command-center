
/**
 * Utility functions for handling view request submissions
 */

// Form data interface
export interface ViewRequestForm {
  requestName: string;
  description: string;
  functionality: string;
  sourceData: string;
  additionalNotes: string;
}

// Submit to Asana webhook
export const submitToAsana = async (webhookUrl: string, formData: ViewRequestForm) => {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify({
      name: formData.requestName,
      notes: formatRequestForAsana(formData),
      resource_type: "task",
      created_at: new Date().toISOString()
    }),
  });
};

// Submit to Zapier webhook
export const submitToZapier = async (webhookUrl: string, formData: ViewRequestForm) => {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify({
      task_name: formData.requestName,
      description: formData.description,
      functionality: formData.functionality,
      source_data: formData.sourceData,
      additional_notes: formData.additionalNotes,
      timestamp: new Date().toISOString(),
      triggered_from: window.location.origin
    }),
  });
};

// Send email (opens email client)
export const sendEmail = (formData: ViewRequestForm) => {
  const email = "michael.laterza@futurenet.com";
  const subject = encodeURIComponent(`New Finance View Request: ${formData.requestName}`);
  const body = encodeURIComponent(formatRequestForEmail(formData));
  
  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
};

// Helper function to format request for Asana
export const formatRequestForAsana = (formData: ViewRequestForm): string => {
  return `
Description: ${formData.description}
Expected Functionality: ${formData.functionality}
Source Data: ${formData.sourceData}
Additional Notes: ${formData.additionalNotes}
  `;
};

// Helper function to format request for Email
export const formatRequestForEmail = (formData: ViewRequestForm): string => {
  return `
Request Name: ${formData.requestName}
Description: ${formData.description}
Expected Functionality: ${formData.functionality}
Source Data: ${formData.sourceData}
Additional Notes: ${formData.additionalNotes}
  `;
};
