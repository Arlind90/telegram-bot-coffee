import asyncio
import logging
import yfinance as yf
from telegram import Bot, Update
from telegram.ext import Application, CommandHandler
from apscheduler.schedulers.background import BackgroundScheduler

# Enable logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Telegram API details
TELEGRAM_API_KEY = "7888234636:AAGoUhjN-9F5CFKU81vAcBMDg1YseBb_EkQ"
CHAT_ID = 789129287

# Initialize Telegram bot
bot = Bot(token=TELEGRAM_API_KEY)

async def get_coffee_price():
    """Fetches the latest coffee price from Yahoo Finance."""
    ticker = "KC=F"  # Coffee Futures symbol
    coffee = yf.Ticker(ticker)
    data = coffee.history(period="1d")  # Get latest daily price

    if not data.empty:
        price = data["Close"].iloc[-1]  # Get latest closing price
        return f"☕ Current Coffee Price: ${price:.2f} per pound"
    else:
        return "Could not fetch coffee price."

async def send_daily_price():
    """Fetches coffee price and sends it to Telegram daily."""
    message = await get_coffee_price()
    await bot.send_message(chat_id=CHAT_ID, text=message)
    logger.info("Daily price update sent.")

def job():
    """Wrapper function to run send_daily_price() asynchronously."""
    asyncio.run(send_daily_price())

# Telegram Command Handlers
async def start(update: Update, context):
    """Handles the /start command."""
    await update.message.reply_text("Welcome! I will provide daily coffee price updates. Use /price to get the latest coffee price.")

async def price(update: Update, context):
    """Handles the /price command."""
    message = await get_coffee_price()
    await update.message.reply_text(message)

async def help_command(update: Update, context):
    """Handles the /help command."""
    help_text = "Available commands:\n/start - Start the bot\n/price - Get coffee price\n/help - Show this help message"
    await update.message.reply_text(help_text)

# Initialize the Telegram bot application
def main():
    app = Application.builder().token(TELEGRAM_API_KEY).build()

    # Add command handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("price", price))
    app.add_handler(CommandHandler("help", help_command))

    # Start APScheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(job, "cron", hour=11, minute=59)  # Sends price update at 8:00 AM daily
    scheduler.start()
    logger.info("Scheduler started for daily updates.")

    # Run the bot
    app.run_polling()

if __name__ == "__main__":
    main()
