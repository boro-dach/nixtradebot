export async function getAssets() {
  const url = "https://pro-api.coingecko.com/api/v3/coins/markets";
  const options = {
    method: "GET",
    // Свойство 'body' полностью удалено
    headers: { "x-cg-pro-api-key": "CG-js6tAL3uLdTWanfRGvoeY1nw" },
  };

  try {
    const response = await fetch(url, options);

    // Добавим проверку статуса ответа
    if (!response.ok) {
      // Если статус не 2xx, выбрасываем ошибку
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${errorData.error || response.statusText}`
      );
    }

    const data = await response.json();
    console.log("SUCCESS:", data);
    return data; // Возвращаем данные для использования в компоненте
  } catch (error) {
    console.error("FETCH ERROR:", error);
    // Пробрасываем ошибку дальше, чтобы компонент мог ее обработать
    throw error;
  }
}
