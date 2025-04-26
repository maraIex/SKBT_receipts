/** @format */

function transformReceipts(backendData, partnerStores = []) {
    // Если backendData - это один объект, преобразуем его в массив
    const receiptsArray = Array.isArray(backendData) ? backendData : [backendData]

    return receiptsArray.map((receipt, index) => {
        // Извлекаем названия продуктов из items
        const products = receipt.items.map((item) => item.name)

        // Объединяем дату и время, если время есть
        const fullDate = receipt.time ? `${receipt.date}T${receipt.time}` : receipt.date

        return {
            id: index + 1, // Простая нумерация, можно заменить на реальный ID из бэкенда
            products: products,
            store: receipt.store,
            date: fullDate,
            amount: receipt.total,
            isPartner: partnerStores.includes(receipt.store),
        }
    })
}
