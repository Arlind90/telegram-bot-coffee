const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, COFFEE_API_URL } = process.env;

// Function to get coffee price
const getCoffeePrice = async () => {
  try {
    const response = await axios.get(COFFEE_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching coffee price:', error);
    return null;
  }
};

// Function to send message to all users
const sendMessageToUsers = async (userIds, message) => {
  for (const userId of userIds) {
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: userId,
        text: message,
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error(`Error sending message to user ${userId}:`, error);
    }
  }
};

// Function to get registered users from database
const getRegisteredUsers = async () => {
  // In a real implementation, you would fetch users from a database
  // For example, using Netlify's FaunaDB integration or another database service
  
  // Placeholder implementation
  return [/* list of user IDs */];
};

// Main handler - this would be triggered by a scheduled event
exports.handler = async (event) => {
  try {
    console.log('Running daily update function');
    
    // Get coffee price
    const priceData = await getCoffeePrice();
    if (!priceData) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch coffee price data' })
      };
    }

    // Format message
    const message = `☕ <b>Daily Coffee Price Update</b> ☕\n\nPrice: ${priceData.price}`;

    // Get registered users
    const users = await getRegisteredUsers();
    
    // Send message to all users
    await sendMessageToUsers(users, message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Daily update sent successfully' })
    };
  } catch (error) {
    console.error('Error in daily update function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error in daily update function' })
    };
  }
}; 