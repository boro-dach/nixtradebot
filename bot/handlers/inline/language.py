from aiogram import Router, types
from keyboards.inline import get_language_menu
from api.language import set_user_language, get_user_language

router = Router()


@router.callback_query(lambda c: c.data == "language")
async def language_menu_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    text = "Выберите язык:" if user_lang == "RU" else "Choose a language:"
    await callback.message.edit_text(text, reply_markup=get_language_menu())
    await callback.answer()


@router.callback_query(lambda c: c.data in {"ru", "eng"})
async def set_language_handler(callback: types.CallbackQuery):
    new_lang = callback.data.upper()
    user_id = callback.from_user.id

    success = set_user_language(user_id, new_lang)
    if not success:
        await callback.answer("Ошибка при смене языка ❌", show_alert=True)
        return

    # Сообщение пользователю
    text = f"Текущий язык: {new_lang}" if new_lang == "RU" else f"Current language: {new_lang}"
    await callback.answer(f"Language changed to {new_lang} ✅")
    await callback.message.edit_text(text, reply_markup=get_language_menu())
