from aiogram import Router, types

router = Router()


@router.callback_query(lambda c: c.data == "withdraw")
async def withdraw_handler(callback: types.CallbackQuery):
    text = (
            "Введите сумму вывода: \n\n"
            "У вас на балансе: 0$\n"
            "Минимальная сумма вывода: 10$"

    )
    await callback.message.answer(text)
    await callback.answer()
