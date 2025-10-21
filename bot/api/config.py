# api/config.py
import aiohttp
import logging
import os
from typing import Optional, Dict

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")

async def get_vat_percentage() -> float:
    """
    Получить текущую ставку НДС
    
    Returns:
        float: Процент НДС (например, 5.0 для 5%)
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{API_BASE_URL}/config/vat") as response:
                if response.status == 200:
                    data = await response.json()
                    return float(data.get('vatPercentage', 0))
                else:
                    logging.error(f"Failed to get VAT percentage: {response.status}")
                    return 0.0
    except Exception as e:
        logging.error(f"Error getting VAT percentage: {e}")
        return 0.0


async def set_vat_percentage(percentage: float) -> bool:
    """
    Установить новую ставку НДС
    
    Args:
        percentage: Процент НДС (например, 5.0 для 5%)
        
    Returns:
        bool: True если успешно, False в противном случае
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{API_BASE_URL}/config/vat",
                json={"vatPercentage": percentage}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get('success'):
                        logging.info(f"VAT percentage set to {percentage}%")
                        return True
                    else:
                        logging.error(f"API returned success=false: {data.get('message')}")
                        return False
                else:
                    logging.error(f"Failed to set VAT percentage: {response.status}")
                    return False
    except Exception as e:
        logging.error(f"Error setting VAT percentage: {e}")
        return False


async def get_min_deposit() -> float:
    """
    Получить минимальную сумму депозита
    
    Returns:
        float: Минимальная сумма депозита
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{API_BASE_URL}/config/min-deposit") as response:
                if response.status == 200:
                    data = await response.json()
                    return float(data.get('minDeposit', 0))
                else:
                    logging.error(f"Failed to get min deposit: {response.status}")
                    return 0.0
    except Exception as e:
        logging.error(f"Error getting min deposit: {e}")
        return 0.0


async def set_min_deposit(amount: float) -> bool:
    """
    Установить минимальную сумму депозита
    
    Args:
        amount: Минимальная сумма депозита
        
    Returns:
        bool: True если успешно, False в противном случае
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{API_BASE_URL}/config/min-deposit",
                json={"minDeposit": amount}
            ) as response:
                if response.status == 200:
                    logging.info(f"Min deposit set to ${amount}")
                    return True
                else:
                    logging.error(f"Failed to set min deposit: {response.status}")
                    return False
    except Exception as e:
        logging.error(f"Error setting min deposit: {e}")
        return False