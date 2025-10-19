from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.types import InlineKeyboardButton

def get_admin_panel_keyboard():
    builder = InlineKeyboardBuilder()

    builder.row(InlineKeyboardButton(text="💬 Диалог", callback_data="admin_dialog"))
    
    builder.row(InlineKeyboardButton(text="Уведомления о действиях: 🟢", callback_data="admin_toggle_notifications"))
    
    builder.row(
        InlineKeyboardButton(text="🍀 Удача", callback_data="admin_luck"),
        InlineKeyboardButton(text="💰 Баланс", callback_data="admin_balance")
    )
    builder.row(InlineKeyboardButton(text="🤑 Мин. депозит", callback_data="admin_min_deposit"))
    
    builder.row(
        InlineKeyboardButton(text="🔒 Заблокировать вывод", callback_data="admin_block_withdraw"),
        InlineKeyboardButton(text="🔒 Заблокировать в боте", callback_data="admin_block_bot")
    )
    
    builder.row(
        InlineKeyboardButton(text="⭕️ Стоп-лимит", callback_data="admin_stop_limit"),
        InlineKeyboardButton(text="⭕️ Сумма стоп-лимита", callback_data="admin_stop_limit_amount")
    )
    
    builder.row(InlineKeyboardButton(text="✅ Верифицировать", callback_data="admin_verify"))
    builder.row(InlineKeyboardButton(text="🏦 Настройка НДС", callback_data="admin_nds_setup"))
    
    builder.row(InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_back_to_main"))

    return builder.as_markup()