from aiogram import Router, F, types, Bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder
from api.user import verify_user, ban_user
import logging

from filters.is_admin import IsAdmin
from keyboards.admin_kb import get_admin_panel_keyboard
from api.balance import get_user_balance, update_asset_balance

router = Router()

class AdminActions(StatesGroup):
    waiting_for_user_id_for_balance = State()
    waiting_for_asset_choice_to_update = State()
    waiting_for_new_balance = State()
    waiting_for_user_id_for_verification = State()

    waiting_for_user_id_for_dialog = State()
    waiting_for_message_for_dialog = State()

    waiting_for_user_id_for_ban = State()


@router.message(Command("admin"), IsAdmin())
async def cmd_admin_panel(message: Message):
    await message.answer(
        "Добро пожаловать в панель администратора!",
        reply_markup=get_admin_panel_keyboard()
    )

@router.callback_query(F.data == "admin_verify", IsAdmin())
async def process_verify_start(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text("Введите Telegram ID пользователя для верификации:")
    await state.set_state(AdminActions.waiting_for_user_id_for_verification)
    await callback.answer()

@router.message(AdminActions.waiting_for_user_id_for_verification, IsAdmin())
async def process_user_id_for_verification(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("ID должен быть числом. Попробуйте еще раз.")
        return

    tgid = int(message.text)

    success = await verify_user(tgid)

    if success:
        await message.answer(f"✅ Пользователь с ID {tgid} успешно верифицирован.")
    else:
        await message.answer(f"❌ Не удалось верифицировать пользователя {tgid}. Проверьте логи или существование пользователя.")

    await state.clear()
    await cmd_admin_panel(message)

@router.callback_query(F.data == "admin_balance", IsAdmin())
async def process_balance_start(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text("Введите Telegram ID пользователя, чтобы посмотреть или изменить его баланс:")
    await state.set_state(AdminActions.waiting_for_user_id_for_balance)
    await callback.answer()

@router.message(AdminActions.waiting_for_user_id_for_balance, IsAdmin())
async def process_user_id_for_balance(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("ID должен быть числом. Попробуйте еще раз.")
        return

    user_id = int(message.text)
    
    balance_data = await get_user_balance(user_id)

    if balance_data is None:
        await message.answer("❌ Произошла ошибка при подключении к API. Попробуйте позже.")
        await state.clear()
        return
    
    if not balance_data:
        await message.answer(f"✅ Пользователь с ID {user_id} найден, но у него нет активов на балансе.")
        await state.clear()
        return

    response_text = f"Балансы пользователя {user_id}:\n\n"
    builder = InlineKeyboardBuilder()

    for asset in balance_data:
        asset_id = asset.get('id')
        crypto_id = asset.get('cryptocurrencyId')
        amount = asset.get('amount')
        
        crypto_name = f"Crypto_{crypto_id}" 
        
        response_text += f"<b>{crypto_name}:</b> <code>{amount}</code>\n"
        builder.row(
            types.InlineKeyboardButton(
                text=f"✏️ Изменить {crypto_name}", 
                callback_data=f"update_asset_{asset_id}"
            )
        )
    
    response_text += "\nВыберите актив для изменения или отправьте /admin для выхода."
    builder.row(types.InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_back_to_main"))
    
    await message.answer(response_text, reply_markup=builder.as_markup(), parse_mode="HTML")
    
    await state.update_data(user_id=user_id)
    await state.set_state(AdminActions.waiting_for_asset_choice_to_update)

@router.callback_query(F.data.startswith("update_asset_"), AdminActions.waiting_for_asset_choice_to_update, IsAdmin())
async def process_asset_choice(callback: CallbackQuery, state: FSMContext):
    asset_balance_id = callback.data.split('_')[-1]
    
    await state.update_data(asset_balance_id_to_update=asset_balance_id)
    
    await callback.message.edit_text("Введите новую сумму для этого актива:")
    await state.set_state(AdminActions.waiting_for_new_balance)
    await callback.answer()


@router.message(AdminActions.waiting_for_new_balance, IsAdmin())
async def process_new_balance(message: Message, state: FSMContext):
    try:
        new_balance = float(message.text)
    except ValueError:
        await message.answer("Неверный формат суммы. Введите число (например, 123.45).")
        return

    user_data = await state.get_data()
    asset_balance_id = user_data.get('asset_balance_id_to_update')
    user_id = user_data.get('user_id')

    success = await update_asset_balance(asset_balance_id, new_balance)

    if success:
        await message.answer(f"✅ Баланс актива для пользователя {user_id} успешно обновлен.")
    else:
        await message.answer("❌ Не удалось обновить баланс. Проверьте логи сервера.")

    await state.clear()
    await cmd_admin_panel(message)


@router.callback_query(F.data == "admin_back_to_main", IsAdmin())
async def process_back(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text(
        "Действие отменено. Вы в главном меню админ-панели.",
        reply_markup=get_admin_panel_keyboard()
    )
    await callback.answer()

@router.message(Command("admin"), IsAdmin())
async def cancel_and_show_panel(message: Message, state: FSMContext):
    await state.clear()
    await cmd_admin_panel(message)

@router.callback_query(F.data == "admin_dialog", IsAdmin())
async def start_dialog_handler(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "Введите Telegram ID пользователя, которому вы хотите отправить сообщение. "
        "Или отправьте /cancel для отмены."
    )
    await state.set_state(AdminActions.waiting_for_user_id_for_dialog)
    await callback.answer()

@router.message(AdminActions.waiting_for_user_id_for_dialog, IsAdmin())
async def process_user_id_for_dialog(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("Ошибка: Telegram ID должен быть числом. Попробуйте еще раз.")
        return

    await state.update_data(dialog_user_id=int(message.text))
    
    await message.answer(
        f"Отлично. Теперь введите сообщение, которое хотите отправить пользователю с ID {message.text}. "
        "Или отправьте /cancel для отмены."
    )
    await state.set_state(AdminActions.waiting_for_message_for_dialog)

@router.message(AdminActions.waiting_for_message_for_dialog, IsAdmin())
async def process_message_for_dialog(message: Message, state: FSMContext, bot: Bot):
    user_data = await state.get_data()
    user_id_to_send = user_data.get('dialog_user_id')
    
    message_text = message.text
    
    try:
        await bot.send_message(
            chat_id=user_id_to_send,
            text=f"Сообщение от администратора:\n\n{message_text}"
        )
        await message.answer(f"✅ Сообщение успешно отправлено пользователю {user_id_to_send}.")
    except Exception as e:
        await message.answer(f"❌ Не удалось отправить сообщение пользователю {user_id_to_send}.\n\nОшибка: {e}")
    
    await state.clear()
    
    await cmd_admin_panel(message)


@router.message(Command("cancel"))
async def cancel_handler(message: Message, state: FSMContext):
    current_state = await state.get_state()
    if current_state is None:
        return

    logging.info("Cancelling state %r", current_state)
    await state.clear()
    await message.answer("Действие отменено.")
    await cmd_admin_panel(message)

@router.callback_query(F.data == "admin_block_bot", IsAdmin())
async def start_ban_handler(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "Введите Telegram ID пользователя, которого вы хотите заблокировать. "
        "Или отправьте /cancel для отмены."
    )
    await state.set_state(AdminActions.waiting_for_user_id_for_ban)
    await callback.answer()

@router.message(AdminActions.waiting_for_user_id_for_ban, IsAdmin())
async def process_user_id_for_ban(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("Ошибка: Telegram ID должен быть числом. Попробуйте еще раз.")
        return

    tgid = int(message.text)
    
    success = await ban_user(tgid, ban_status=True)
    
    if success:
        await message.answer(f"✅ Пользователь с ID {tgid} успешно заблокирован.")
    else:
        await message.answer(f"❌ Не удалось заблокировать пользователя {tgid}. Проверьте логи или существование пользователя.")
        
    await state.clear()
    await cmd_admin_panel(message)