from aiogram import Router, types
from keyboards.inline import web_app_menu

router = Router()


@router.message(lambda m: m.text == "🌐 Наш веб сайт")
async def webapp_handler(message: types.Message):
    text = (
            "🚀 Откройте наш вебсайт прямо в Telegram и начните "
            "торговать криптовалютой в пару кликов!"
    )
    await message.answer(text, reply_markup=web_app_menu)
