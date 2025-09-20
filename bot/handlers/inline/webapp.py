from aiogram import Router, types
from keyboards.inline import get_web_app_menu
from api.language import get_user_language

router = Router()

@router.message(lambda m: m.text == "🌐 Наш веб сайт")
async def webapp_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = (
        "🚀 Запустите наш веб-сайт прямо в Telegram и начните "
        "торговать криптовалютой всего в несколько кликов!"
        if user_lang == "RU"
        else
        "🚀 Open our website directly in Telegram and start "
        "trading cryptocurrency in just a few clicks!"
    )
    keyboard = get_web_app_menu()
    await message.answer(text, reply_markup=keyboard)
