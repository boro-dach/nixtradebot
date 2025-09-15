import asyncio
from aiogram import Bot, Dispatcher
from handlers.inline import profile, deposit, options, about, webapp, withdraw
from handlers import start
import os
from dotenv import load_dotenv

load_dotenv()

bot = Bot(token=os.getenv('BOT_TOKEN'))
dp = Dispatcher()

async def main():
    dp.include_router(start.router)
    dp.include_router(profile.router)
    dp.include_router(deposit.router)
    dp.include_router(options.router)
    dp.include_router(about.router)
    dp.include_router(webapp.router)
    dp.include_router(withdraw.router)
    
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
