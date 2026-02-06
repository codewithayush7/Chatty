import brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

export const sendEmail = async ({ to, subject, html }) => {
  const sendSmtpEmail = {
    to: [{ email: to }],
    subject,
    htmlContent: html,

    // 👇 MUST exactly match a verified sender
    sender: {
      name: "Chatty",
      email: "themidnightmind.ai@gmail.com",
    },
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Brevo email error:", error?.response?.data || error.message);
    throw new Error("Failed to send email");
  }
};
