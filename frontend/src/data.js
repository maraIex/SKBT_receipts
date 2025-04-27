/** @format */
// Эмуляция данных полученных с БД
export const receipts = [
    {
        id: 1,
        products: ["Хлеб", "Чай Greenfield"],
        store: "Пятёрочка",
        date: "2025-03-15",
        amount: 2450,
        isPartner: true,
    },
    {
        id: 2,
        products: ["Игровая мышь", "Коврик для мыши"],
        store: "DNS",
        date: "2025-03-14",
        amount: 18990,
        isPartner: false,
    },
    {
        id: 3,
        products: ["Молоко", "Яйца", "Сахар"],
        store: "Магнит",
        date: "2025-03-12",
        amount: 870,
        isPartner: true,
    },
    {
        id: 4,
        products: ["Капучино", "Круассан"],
        store: "Coffee Like",
        date: "2025-03-10",
        amount: 560,
        isPartner: false,
    },
    {
        id: 5,
        products: ["мяч"],
        store: "Спортмастер",
        date: "2025-03-10",
        amount: 560,
        isPartner: false,
    },
    {
        id: 6,
        products: ["Пенталгин"],
        store: "Аптека 36.6",
        date: "2025-03-10",
        amount: 560,
        isPartner: false,
    },
]

export const productData = [
    { name: "Суп яичный", category: "Рестораны", cost: "50", quantity: "1" },
    { name: "Мясо по-французски", category: "Рестораны", cost: "130", quantity: "1" },
    { name: "Хлеб", category: "Супермаркеты", cost: "40", quantity: "2" },
    { name: "Футбольный мяч", category: "Спорт", cost: "800", quantity: "1" },
    { name: "Нурофен", category: "Медицина", cost: "110", quantity: "1" },
    { name: "Яндекс Плюс", category: "Хобби и развлечения", cost: "399", quantity: "1" },
]

export const PARTNER_STORES = [
    { shop_id: 1, name: "Пятёрочка", category: "Супермаркеты" },
    { shop_id: 2, name: "Магнит", category: "Супермаркеты" },
    { shop_id: 3, name: "Перекрёсток", category: "Супермаркеты" },
    { shop_id: 4, name: "Burger King", category: "Рестораны" },
    { shop_id: 5, name: "KFC", category: "Рестораны" },
    { shop_id: 6, name: "Теремок", category: "Рестораны" },
    { shop_id: 7, name: "Спортмастер", category: "Спорт" },
    { shop_id: 8, name: "Adidas", category: "Спорт" },
    { shop_id: 9, name: "Decathlon", category: "Спорт" },
    { shop_id: 10, name: "Аптека 36.6", category: "Медицина" },
    { shop_id: 11, name: "Ригла", category: "Медицина" },
    { shop_id: 12, name: "Еврофарм", category: "Медицина" },
    { shop_id: 13, name: "Мосигра", category: "Хобби и развлечения" },
    { shop_id: 14, name: "Читай-город", category: "Хобби и развлечения" },
    { shop_id: 15, name: "Ozon Experience", category: "Хобби и развлечения" },
]
// Расчёты
export const totalСost = calculateTotalCost(productData)
export const totalCostByCategory = calculateCostByCategory(productData, totalСost)
export const topThreeCategories = getTopThreeCategories(totalCostByCategory)

// Внутренние данные
export const chartColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6B6B",
    "#4ECDC4",
    "#FFA577",
]

// Функции
// Функция подсчёта общей стоимости
function calculateTotalCost(products) {
    return products.reduce((total, product) => {
        const price = Number(product.cost) || 0
        const quantity = Number(product.quantity) || 0
        return total + price * quantity
    }, 0)
}

// Функция подсчёта общей стоимости по категориям
function calculateCostByCategory(products, totalCost) {
    const categoriesOrder = ["Рестораны", "Супермаркеты", "Спорт", "Медицина", "Хобби и развлечения"]

    const result = {}

    // Инициализация всех категорий с нулевыми значениями
    categoriesOrder.forEach((category) => {
        result[category] = 0
    })

    // Заполнение данными
    products.forEach((product) => {
        const cost = Number(product.cost) * Number(product.quantity)
        if (result.hasOwnProperty(product.category)) {
            result[product.category] += cost
        }
    })

    // Формирование результата в заданном порядке
    return categoriesOrder.map((name) => ({
        categoryName: name,
        value: result[name],
        percentageOfTotal: totalCost > 0 ? Math.round((result[name] / totalCost) * 100) : 0,
    }))
}

// Функция вычисления категорий с самым большим процентом трат
function getTopThreeCategories(data) {
    const sorted = [...data].sort((a, b) => b.percentageOfTotal - a.percentageOfTotal)

    return sorted.slice(0, 3)
}
