import requests
import logging

logger = logging.getLogger(__name__)
API_URL_BASE = "http://localhost:5000/user/language"


def set_user_language(user_id: int, language: str) -> bool:
    """
    Установить язык пользователя через API.
    """
    try:
        response = requests.post(
            API_URL_BASE,
            json={"tgid": user_id, "language": language.upper()},
            timeout=5
        )
        response.raise_for_status()
        logger.info(f"Language for user {user_id} set to {language.upper()} via API")
        return True
    except Exception as e:
        logger.error(f"Failed to set language for user {user_id}: {e}")
        return False


def get_user_language(user_id: int) -> str:
    """
    Получить язык пользователя через API.
    """
    try:
        response = requests.get(f"{API_URL_BASE}?tgid={user_id}", timeout=5)
        response.raise_for_status()
        lang = response.json().get("language", "RU")
        return lang.lower()
    except Exception as e:
        logger.error(f"Failed to get language for user {user_id}: {e}")
        return "RU"
