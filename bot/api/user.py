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