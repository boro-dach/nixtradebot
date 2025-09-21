import aiohttp
import asyncio

BASE_URL = "http://localhost:5000"

async def login(tgid: int) -> dict:
    url = f"{BASE_URL}/auth/login"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json={"tgid": tgid}) as resp:
                if resp.status == 200:
                    return await resp.json()
                return {"error": f"HTTP {resp.status}", "text": await resp.text()}
    except Exception as e:
        return {"error": str(e)}