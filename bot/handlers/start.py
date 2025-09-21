from aiogram import Router, types
from aiogram.filters import Command
from keyboards.reply import main_menu
from api.login import login
from keyboards.translations import TEXTS
from api.language import get_user_language 

router = Router()

@router.message(Command("start"))
async def cmd_start(message: types.Message):
    tgid = message.from_user.id

    # Авторизация
    login_result = await login(tgid)
    print("Ответ api: ", login_result)

    user_lang = get_user_language(tgid)
    texts = TEXTS.get(user_lang, TEXTS["ru"])

    await message.answer(
        texts["welcome"],
        reply_markup=main_menu
    )
