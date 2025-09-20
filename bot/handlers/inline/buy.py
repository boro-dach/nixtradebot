from aiogram import Router, types
from keyboards.inline import buy_menu

router = Router()

@router.callback_query(lambda c: c.data == "buy")
async def buy_handler(callback: types.CallbackQuery):

    text = (
        "ℹ️ Покупка актива по текущей цене на момент заключения  "
        "сделки. В контексте финансовых рынков, спот-сделки  "
        "обычно заключаются на валютных и товарных рынках. При "
        "покупке спотов, трейдер покупает актив и сразу же  "
        "получает его в свое распоряжение.\n\n "
        "Популярные монеты на споте с низкими комиссиями:"
        )

    await callback.message.answer(text, reply_markup=buy_menu)
    await callback.answer()