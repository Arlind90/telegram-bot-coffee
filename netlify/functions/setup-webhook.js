const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, WEBHOOK_URL } = process.env;

exports.handler = async (event) => {
  // Only allow GET requests for this setup function
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Register webhook with Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        url: `${WEBHOOK_URL}/.netlify/functions/telegram-webhook`
      }
    );

    console.log('Webhook setup response:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Webhook setup complete', data: response.data })
    };
  } catch (error) {
    console.error('Error setting up webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to set up webhook' })
    };
  }
}; 