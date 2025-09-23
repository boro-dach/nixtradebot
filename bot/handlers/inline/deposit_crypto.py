from aiogram import Router, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.filters import StateFilter
from api.language import get_user_language
from keyboards.inline import get_deposit_crypto_menu

router = Router()

class DepositTONStates(StatesGroup):
    waiting_for_amount = State()

class DepositUSDTStates(StatesGroup):
    waiting_for_amount = State()

class DepositBTCStates(StatesGroup):
    waiting_for_amount = State()

class DepositETHStates(StatesGroup):
    waiting_for_amount = State()

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

    text = (f"Пожалуйста, отправьте {amount} TON на следующий адрес:\n\n`{deposit_address}`"
            if user_lang == "ru" else
            f"Please send {amount} TON to the following address:\n\n`{deposit_address}`")

    await message.answer(text, parse_mode="Markdown")
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

    text = (f"Пожалуйста, отправьте {amount} USDT по сети TRC20 на следующий адрес:\n\n`{deposit_address}`"
            if user_lang == "ru" else
            f"Please send {amount} USDT in TRC20 network to the following address:\n\n`{deposit_address}`")

    await message.answer(text, parse_mode="Markdown")
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

    text = (f"Пожалуйста, отправьте {amount} Bitcoin на следующий адрес:\n\n`{deposit_address}`"
            if user_lang == "ru" else
            f"Please send {amount} Bitcoin to the following address:\n\n`{deposit_address}`")

    await message.answer(text, parse_mode="Markdown")
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

    text = (f"Пожалуйста, отправьте {amount} Ethereum на следующий адрес:\n\n`{deposit_address}`"
            if user_lang == "ru" else
            f"Please send {amount} Ethereum network to the following address:\n\n`{deposit_address}`")

    await message.answer(text, parse_mode="Markdown")
    await state.clear()