from aiogram import Router, types
from keyboards.inline import profile_menu

router = Router()


@router.message(lambda m: m.text == "💼 Личный кабинет")
async def profile_handler(message: types.Message):
    text = (
            "💼 Личный кабинет:\n\n"
            "🔐 Верификация: ❌\n"
            f"🆔 ID: {message.from_user.id}\n"
            "💰 Баланс: 0₽\n\n"
            "📊 Статистика пользователя:\n"
            "├ Всего сделок проведено: 0\n"
            "├ Неудачных: 0\n"
            "├ Удачных: 0\n"
            "└ Выводов совершено 0 на сумму 0₽\n\n"
            "Откройте двери в мир криптовалют вместе с NIX TRADE –"
            "Вашим верным спутником в онлайн-трейдинге на финансовых рынках."
    )
    await message.answer(text, reply_markup=profile_menu)
