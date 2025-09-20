from aiogram import Router, types
from aiogram.filters import Command
from keyboards.reply import main_menu
from api.login import login
from keyboards.translations import TEXTS
import config as g

router = Router()

@router.message(Command("start"))
async def cmd_start(message: types.Message):

    tgid = message.from_user.id

    login_result = await login(tgid)
    print("Ответ api: ", login_result)

    await message.answer(
        TEXTS[g.language].welcome,
        reply_markup=main_menu
    )
