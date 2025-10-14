import aiohttp
import logging
from typing import Optional, Dict, List

API_BASE_URL = "http://localhost:5001"

async def set_price_manipulation(asset_id: str, multiplier: float) -> bool:
    url = f"{API_BASE_URL}/market/admin/manipulate"
    payload = {
        "assetId": asset_id,
        "multiplier": multiplier
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200 or response.status == 201:
                    logging.info(f"Price manipulation set for {asset_id} with multiplier {multiplier}")
                    return True
                else:
                    error_text = await response.text()
                    logging.error(f"Failed to set price manipulation: {response.status} - {error_text}")
                    return False
    except Exception as e:
        logging.error(f"Exception when setting price manipulation: {e}")
        return False


async def remove_price_manipulation(asset_id: str) -> bool:
    url = f"{API_BASE_URL}/market/admin/manipulate/{asset_id}"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.delete(url) as response:
                if response.status == 200:
                    logging.info(f"Price manipulation removed for {asset_id}")
                    return True
                else:
                    error_text = await response.text()
                    logging.error(f"Failed to remove price manipulation: {response.status} - {error_text}")
                    return False
    except Exception as e:
        logging.error(f"Exception when removing price manipulation: {e}")
        return False


async def get_active_manipulations() -> Optional[List[Dict]]:
    url = f"{API_BASE_URL}/market/admin/manipulations"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    logging.info(f"Retrieved {len(data)} active manipulations")
                    return data
                else:
                    error_text = await response.text()
                    logging.error(f"Failed to get manipulations: {response.status} - {error_text}")
                    return []
    except Exception as e:
        logging.error(f"Exception when getting manipulations: {e}")
        return []