from aiogram import Router, types
from api.language import get_user_language

router = Router()

@router.callback_query(lambda c: c.data == "withdraw")
async def withdraw_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    text = (
        "Введите сумму вывода:\n\nУ вас на балансе: 0$\nМинимальная сумма вывода: 10$"
        if user_lang == "RU"
        else
        "Enter the withdrawal amount:\n\nYour current balance: 0$\nMinimum withdrawal amount: 10$"
    )
    await callback.message.answer(text)
    await callback.answer()
