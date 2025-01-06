import axios, { AxiosRequestConfig } from 'axios';

interface MessageData {
  messaging_product: string;
  preview_url: boolean;
  recipient_type: string;
  to: string;
  type: string;
  text: {
    body: string;
  };
}

function sendMessage(data: any): Promise<any> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return axios(config);
}

function getTextMessageInput(recipient: string, text: string): string {
  const message: MessageData = {
    messaging_product: "whatsapp",
    preview_url: false,
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: {
      body: text,
    },
  };

  return JSON.stringify(message);
}

export { sendMessage, getTextMessageInput };
