import "dotenv/config";

const sendSMS = async ({parentContact,studentName,studentCode,amount,balance}) => {
  const url = `https://api.mnotify.com/api/sms/quick?key=${process.env.MNOTIFY_API_KEY}`;

const message =
  `School Fees Payment Received\n` +
  `Student: ${studentName}\n` +
  `Index No: ${studentCode}\n` +
  `Paid: GHS ${String(Number(amount).toFixed(2))}\n` +
  `Balance: GHS ${String(Number(balance).toFixed(2))}\n` +
  `Thank you.`;


  const payload = {
    recipient: [parentContact], 
    sender: "LucasModel",
    message
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("SMS response:", text);

    return true;
  } catch (err) {
    console.error("SMS error:", err);
    return false;
  }
};

export default sendSMS;
