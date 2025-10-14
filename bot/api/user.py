import os
import logging
import aiohttp
from dotenv import load_dotenv
from typing import Optional, Dict, Any

load_dotenv()

BASE_URL = os.getenv("API_BASE_URL")


async def get_user_by_id(tgid: int) -> Optional[Dict[str, Any]]:
    url = f"{BASE_URL}/user/{tgid}"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 404:
                    logging.warning(f"User {tgid} not found in DB.")
                    return None
                else:
                    logging.error(f"Failed to get user {tgid}. Status: {response.status}")
                    return None
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error while getting user {tgid}: {e}")
        return None


async def verify_user(tgid: int) -> bool:
    url = f"{BASE_URL}/user/verify"
    payload = {
        "tgid": str(tgid)
    }
    logging.info(f"Attempting to verify user with payload: {payload}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    logging.info(f"Successfully verified user {tgid}.")
                    return True
                else:
                    logging.error(
                        f"Failed to verify user {tgid}. "
                        f"Status: {response.status}, "
                        f"Response: {await response.text()}"
                    )
                    return False
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error during verification: {e}")
        return False


async def ban_user(tgid: int, ban_status: bool) -> bool:
    url = f"{BASE_URL}/user/ban"
    payload = {
        "tgid": str(tgid),
        "ban": ban_status
    }
    action = "ban" if ban_status else "unban"
    logging.info(f"Attempting to {action} user {tgid} with payload: {payload}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    logging.info(f"Successfully executed {action} for user {tgid}")
                    return True
                else:
                    logging.error(
                        f"Failed to {action} user {tgid}. "
                        f"Status: {response.status}, "
                        f"Response: {await response.text()}"
                    )
                    return False
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error during {action}ning user: {e}")
        return False


async def set_user_luck(tgid: int, is_lucky: bool) -> bool:
    """
    Установить или снять флаг удачи для пользователя
    
    Args:
        tgid: Telegram ID пользователя
        is_lucky: True для включения удачи, False для выключения
    
    Returns:
        bool: True если успешно, False если ошибка
    """
    url = f"{BASE_URL}/user/luck"
    payload = {
        "tgid": tgid,
        "isLucky": is_lucky
    }
    action = "enable" if is_lucky else "disable"
    logging.info(f"Attempting to {action} luck for user {tgid} with payload: {payload}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200 or response.status == 201:
                    logging.info(f"Successfully {action}d luck for user {tgid}")
                    return True
                else:
                    logging.error(
                        f"Failed to {action} luck for user {tgid}. "
                        f"Status: {response.status}, "
                        f"Response: {await response.text()}"
                    )
                    return False
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error during luck modification: {e}")
        return False


async def get_user_info(tgid: int) -> Optional[Dict[str, Any]]:
    """
    Получить полную информацию о пользователе
    (это просто алиас для get_user_by_id для совместимости)
    
    Args:
        tgid: Telegram ID пользователя
    
    Returns:
        Dict: Информация о пользователе или None если ошибка
    """
    return await get_user_by_id(tgid)


async def set_withdraw_block(tgid: int, is_blocked: bool) -> bool:
    """
    Заблокировать или разблокировать вывод средств для пользователя
    
    Args:
        tgid: Telegram ID пользователя
        is_blocked: True для блокировки вывода, False для разблокировки
    
    Returns:
        bool: True если успешно, False если ошибка
    """
    url = f"{BASE_URL}/user/withdraw-block"
    payload = {
        "tgid": tgid,
        "isBannedWithdraw": is_blocked
    }
    action = "block" if is_blocked else "unblock"
    logging.info(f"Attempting to {action} withdraw for user {tgid} with payload: {payload}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200 or response.status == 201:
                    logging.info(f"Successfully {action}ed withdraw for user {tgid}")
                    return True
                else:
                    logging.error(
                        f"Failed to {action} withdraw for user {tgid}. "
                        f"Status: {response.status}, "
                        f"Response: {await response.text()}"
                    )
                    return False
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error during withdraw block modification: {e}")
        return False
    
async def set_withdraw_ban(tgid: int, ban_status: bool) -> bool:
    """
    Отправляет запрос на блокировку (ban_status=True) или 
    разблокировку (ban_status=False) вывода средств.
    """
    # Этот URL должен соответствовать вашему UserController
    # POST /user/withdraw-block
    url = f"{BASE_URL}/user/withdraw-block" 
    
    # Бэкенд ожидает поля `tgid` и `isBannedWithdraw`
    payload = {
        "tgid": tgid,
        "isBannedWithdraw": ban_status
    }
    
    action = "block" if ban_status else "unblock"
    logging.info(f"Attempting to {action} withdraw for user {tgid}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    logging.info(f"Successfully {action}ed withdraw for user {tgid}")
                    return True
                else:
                    logging.error(
                        f"Failed to {action} withdraw for user {tgid}. "
                        f"Status: {response.status}, Response: {await response.text()}"
                    )
                    return False
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error during withdraw ban: {e}")
        return False