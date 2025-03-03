# Telegram Coffee Price Bot

A Telegram bot that sends daily coffee price updates at 9:00 AM.

## Deployment on Netlify

### Prerequisites
- A Telegram bot token (obtain from [@BotFather](https://t.me/botfather))
- A Netlify account connected to your GitHub repository
- GitHub repository with this code

### Environment Variables

Set the following environment variables in your Netlify site settings:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `COFFEE_API_URL`: URL to fetch coffee price data
- `WEBHOOK_URL`: Your Netlify site URL (e.g., https://your-app-name.netlify.app)

### Scheduled Function

For the daily 9:00 AM update, set up a scheduled function in Netlify:

1. Go to your Netlify site settings
2. Navigate to "Functions" > "Scheduled functions"
3. Add a new scheduled function that triggers `daily-update` at 9:00 AM daily
   - Use cron expression: `0 9 * * *`

### Setup Steps

1. Push this code to your GitHub repository
2. Connect the repository to Netlify
3. Set required environment variables
4. Deploy the site
5. Once deployed, visit `https://your-app-name.netlify.app/.netlify/functions/setup-webhook` to register your webhook with Telegram

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with required environment variables
3. Run the development server:
   ```
   npm run dev
   ```

## Architecture

- `telegram-webhook.js`: Handles incoming messages from Telegram
- `daily-update.js`: Sends the daily coffee price update
- `setup-webhook.js`: Registers the webhook with Telegram

## Note

This bot uses Netlify Functions which are serverless, meaning they only run when triggered. The daily update is handled through Netlify's scheduled functions feature. 