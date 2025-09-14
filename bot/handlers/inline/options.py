from aiogram import Router, types
from keyboards.inline import coins_menu

router = Router()

@router.message(lambda m: m.text == "📊 Опционы")
async def options_handler(message: types.Message):
    text = (
        "Опционы - это финансовые инструменты, которые ",
        "дают инвестору право, но не обязательство, купить ",
        "или продать определенное количество акций или ",
        "других активов по определенной цене в ",
        "определенный момент в будущем.\n\n\n"        
        "💠 Выберите монету для инвестирования денежных ",
        "средств:"
    )

    await message.answer(text, reply_markup=coins_menu)