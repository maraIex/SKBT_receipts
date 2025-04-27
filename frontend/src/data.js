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
]

export const productData = [
    { name: "Суп яичный", category: "Рестораны", cost: "50", quantity: "1" },
    { name: "Мясо по-французски", category: "Рестораны", cost: "130", quantity: "1" },
    { name: "Хлеб", category: "Супермаркеты", cost: "40", quantity: "2" },
    { name: "Футбольный мяч", category: "Спорт", cost: "800", quantity: "1" },
    { name: "Нурофен", category: "Медицина", cost: "110", quantity: "1" },
    { name: "Яндекс Плюс", category: "Хобби и развлечения", cost: "399", quantity: "1" },
]

export const PARTNER_STORES = ["Пятёрочка", "Магнит", "Лента", "Перекрёсток"]

// Расчёты
export const totalCost = calculateTotalCost(productData)
export const totalCostByCategory = calculateCostByCategory(productData, totalCost)
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
    const result = {}

    products.forEach((product) => {
        const cost = Number(product.cost) * Number(product.quantity)
        if (!result[product.category]) {
            result[product.category] = 0
        }
        result[product.category] += cost
    })

    return Object.entries(result).map(([name, cost]) => ({
        categoryName: name,
        value: cost,
        percentageOfTotal: totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0,
    }))
}

// Функция вычисления категорий с самым большим процентом трат
function getTopThreeCategories(data) {
    const sorted = [...data].sort((a, b) => b.percentageOfTotal - a.percentageOfTotal)

    return sorted.slice(0, 3)
}
