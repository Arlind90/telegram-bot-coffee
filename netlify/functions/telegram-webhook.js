const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, USERS_DB_PATH } = process.env;

// Function to send message to Telegram
const sendMessage = async (chatId, text) => {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Main handler for Telegram webhook
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Received webhook data:', JSON.stringify(data));

    // Handle message
    if (data.message) {
      const chatId = data.message.chat.id;
      const messageText = data.message.text || '';

      if (messageText === '/start') {
        // Handle start command
        await sendMessage(chatId, 'Welcome to the Coffee Price Bot! You will receive daily updates at 9AM.');
        
        // Store user info in database (in a real implementation)
        // ...
      }
      // Add other command handlers as needed
    }

    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error processing webhook' })
    };
  }
}; 