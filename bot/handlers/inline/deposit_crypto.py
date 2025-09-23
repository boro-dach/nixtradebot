from aiogram import Router, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.filters import StateFilter
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from api.language import get_user_language
from api.transaction import create_transaction  # Импортируем нашу функцию
from keyboards.inline import get_deposit_crypto_menu
import logging

router = Router()

class DepositTONStates(StatesGroup):
    waiting_for_amount = State()

class DepositUSDTStates(StatesGroup):
    waiting_for_amount = State()

class DepositBTCStates(StatesGroup):
    waiting_for_amount = State()

class DepositETHStates(StatesGroup):
    waiting_for_amount = State()

def get_confirm_button(currency: str, amount: float):
    """Создает клавиатуру с кнопкой подтверждения"""
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="✅ Подтвердить перевод",
            callback_data=f"confirm_deposit_{currency.lower()}_{amount}"
        )]
    ])
    return keyboard

@router.callback_query(lambda c: c.data == "crypto")
async def deposit_crypto(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    text = "Выберите монету для пополнения" if user_lang == "ru" else "Choose currency for deposit:"

    keyboard = get_deposit_crypto_menu()
    
    await callback.message.answer(text, reply_markup=keyboard)
    await callback.answer()

@router.callback_query(lambda c: c.data == "deposit_ton")
async def deposit_ton(callback: types.CallbackQuery, state: FSMContext):
    user_lang = get_user_language(callback.from_user.id)
    text = "Введите сумму для депозита TON:" if user_lang == "ru" else "Please enter the amount of TON to deposit:"
    
    await callback.message.answer(text)
    await state.set_state(DepositTONStates.waiting_for_amount)
    await callback.answer()

@router.message(StateFilter(DepositTONStates.waiting_for_amount))
async def process_ton_amount(message: types.Message, state: FSMContext):
    user_lang = get_user_language(message.from_user.id)
    
    try:
        amount = float(message.text)
        if amount <= 0:
            raise ValueError
    except ValueError:
        text = "Введите корректное положительное число." if user_lang == "ru" else "Please enter a valid positive number."
        await message.answer(text)
        return

    deposit_address = "UQAL4wSs8g145h4704Q1to_mPCjCBEZAv0NVsIjmMFODqy8H"

    text = (f"Пожалуйста, отправьте {amount} TON на следующий адрес:\n\n`{deposit_address}`\n\n"
            f"После отправки нажмите кнопку подтверждения ниже."
            if user_lang == "ru" else
            f"Please send {amount} TON to the following address:\n\n`{deposit_address}`\n\n"
            f"After sending, click the confirmation button below.")

    keyboard = get_confirm_button("TON", amount)
    await message.answer(text, parse_mode="Markdown", reply_markup=keyboard)
    await state.clear()

@router.callback_query(lambda c: c.data == "deposit_usdt")
async def deposit_usdt(callback: types.CallbackQuery, state: FSMContext):
    user_lang = get_user_language(callback.from_user.id)
    text = "Введите сумму для депозита USDT TRC20:" if user_lang == "ru" else "Please enter the amount of USDT TRC20 to deposit:"

    await callback.message.answer(text)
    await state.set_state(DepositUSDTStates.waiting_for_amount)
    await callback.answer()

@router.message(StateFilter(DepositUSDTStates.waiting_for_amount))
async def process_usdt_amount(message: types.Message, state: FSMContext):
    user_lang = get_user_language(message.from_user.id)
    
    try:
        amount = float(message.text)
        if amount <= 0:
            raise ValueError
    except ValueError:
        text = "Введите корректное положительное число." if user_lang == "ru" else "Please enter a valid positive number."
        await message.answer(text)
        return

    deposit_address = "TDKKeUvjmaog2JgFuLD7NqVvrbjnMfu5pF"

    text = (f"Пожалуйста, отправьте {amount} USDT по сети TRC20 на следующий адрес:\n\n`{deposit_address}`\n\n"
            f"После отправки нажмите кнопку подтверждения ниже."
            if user_lang == "ru" else
            f"Please send {amount} USDT in TRC20 network to the following address:\n\n`{deposit_address}`\n\n"
            f"After sending, click the confirmation button below.")

    keyboard = get_confirm_button("USDT", amount)
    await message.answer(text, parse_mode="Markdown", reply_markup=keyboard)
    await state.clear()

@router.callback_query(lambda c: c.data == "deposit_bitcoin")
async def deposit_bitcoin(callback: types.CallbackQuery, state: FSMContext):
    user_lang = get_user_language(callback.from_user.id)
    text = "Введите сумму для депозита Bitcoin:" if user_lang == "ru" else "Please enter the amount of Bitcoin to deposit:"
    
    await callback.message.answer(text)
    await state.set_state(DepositBTCStates.waiting_for_amount)
    await callback.answer()

@router.message(StateFilter(DepositBTCStates.waiting_for_amount))
async def process_bitcoin_amount(message: types.Message, state: FSMContext):
    user_lang = get_user_language(message.from_user.id)
    
    try:
        amount = float(message.text)
        if amount <= 0:
            raise ValueError
    except ValueError:
        text = "Введите корректное положительное число." if user_lang == "ru" else "Please enter a valid positive number."
        await message.answer(text)
        return

    deposit_address = "bc1qaytwrtzttgusr2dph76wz2pjrhzdjqtzz5qk3y"

    text = (f"Пожалуйста, отправьте {amount} Bitcoin на следующий адрес:\n\n`{deposit_address}`\n\n"
            f"После отправки нажмите кнопку подтверждения ниже."
            if user_lang == "ru" else
            f"Please send {amount} Bitcoin to the following address:\n\n`{deposit_address}`\n\n"
            f"After sending, click the confirmation button below.")

    keyboard = get_confirm_button("BTC", amount)
    await message.answer(text, parse_mode="Markdown", reply_markup=keyboard)
    await state.clear()

@router.callback_query(lambda c: c.data == "deposit_eth")
async def deposit_eth(callback: types.CallbackQuery, state: FSMContext):
    user_lang = get_user_language(callback.from_user.id)
    text = "Введите сумму для депозита Ethereum:" if user_lang == "ru" else "Please enter the amount of Ethereum to deposit:"
    
    await callback.message.answer(text)
    await state.set_state(DepositETHStates.waiting_for_amount)
    await callback.answer()

@router.message(StateFilter(DepositETHStates.waiting_for_amount))
async def process_eth_amount(message: types.Message, state: FSMContext):
    user_lang = get_user_language(message.from_user.id)
    
    try:
        amount = float(message.text)
        if amount <= 0:
            raise ValueError
    except ValueError:
        text = "Введите корректное положительное число." if user_lang == "ru" else "Please enter a valid positive number."
        await message.answer(text)
        return

    deposit_address = "0x61F6C55caAf6D50b4c8764A17916DB6af61079ed"

    text = (f"Пожалуйста, отправьте {amount} Ethereum на следующий адрес:\n\n`{deposit_address}`\n\n"
            f"После отправки нажмите кнопку подтверждения ниже."
            if user_lang == "ru" else
            f"Please send {amount} Ethereum to the following address:\n\n`{deposit_address}`\n\n"
            f"After sending, click the confirmation button below.")

    keyboard = get_confirm_button("ETH", amount)
    await message.answer(text, parse_mode="Markdown", reply_markup=keyboard)
    await state.clear()

# Обработчик для кнопок подтверждения с интеграцией API
@router.callback_query(lambda c: c.data.startswith("confirm_deposit_"))
async def confirm_deposit(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    
    try:
        # Извлекаем данные из callback_data
        data_parts = callback.data.split("_")
        currency = data_parts[2].upper()  # TON, USDT, BTC, ETH
        amount = float(data_parts[3])
        
        # Отправляем уведомление о начале обработки
        processing_text = (
            "⏳ Обрабатываем вашу заявку..."
            if user_lang == "ru" else
            "⏳ Processing your request..."
        )
        await callback.message.edit_text(processing_text)
        
        # Создаем транзакцию через API
        transaction_data = await create_transaction(
            user_id=callback.from_user.id,
            amount=amount,
            currency=currency,
            transaction_type="DEPOSIT"
        )
        
        if transaction_data:
            # Успешно создана транзакция
            transaction_id = transaction_data.get("id", "Unknown")
            status = transaction_data.get("status", "PROCESSING")
            
            success_text = (
                f"✅ Ваша заявка на пополнение {amount} {currency} принята!\n\n"
                f"🆔 ID транзакции: `{transaction_id}`\n"
                f"📊 Статус: {status}\n\n"
                f"Средства будут зачислены на ваш баланс после подтверждения транзакции.\n"
                f"Обычно это занимает 5-30 минут."
                if user_lang == "ru" else
                f"✅ Your deposit request for {amount} {currency} has been accepted!\n\n"
                f"🆔 Transaction ID: `{transaction_id}`\n"
                f"📊 Status: {status}\n\n"
                f"Funds will be credited to your balance after transaction confirmation.\n"
                f"This usually takes 5-30 minutes."
            )
            
            await callback.message.edit_text(success_text, parse_mode="Markdown")
            await callback.answer(
                "Заявка принята!" if user_lang == "ru" else "Request accepted!"
            )
            
            # Логируем успешную операцию
            logging.info(
                f"Deposit request created: User {callback.from_user.id}, "
                f"Amount {amount} {currency}, Transaction ID: {transaction_id}"
            )
            
        else:
            # Ошибка при создании транзакции
            error_text = (
                "❌ Произошла ошибка при создании заявки.\n"
                "Попробуйте позже или обратитесь в поддержку."
                if user_lang == "ru" else
                "❌ An error occurred while creating the request.\n"
                "Please try again later or contact support."
            )
            
            await callback.message.edit_text(error_text)
            await callback.answer(
                "Ошибка!" if user_lang == "ru" else "Error!"
            )
            
            # Логируем ошибку
            logging.error(
                f"Failed to create deposit request: User {callback.from_user.id}, "
                f"Amount {amount} {currency}"
            )
        
    except Exception as e:
        # Обработка неожиданных ошибок
        logging.error(f"Error in confirm_deposit handler: {e}")
        
        error_text = (
            "❌ Произошла непредвиденная ошибка.\nОбратитесь в поддержку."
            if user_lang == "ru" else
            "❌ An unexpected error occurred.\nPlease contact support."
        )
        
        await callback.message.edit_text(error_text)
        await callback.answer(
            "Ошибка!" if user_lang == "ru" else "Error!"
        )