/** @format */
import { Typography, Divider, Card, Tag } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Label } from "recharts"
import { chartColors, totalCostByCategory, totalСost, PARTNER_STORES, receipts } from "../../data"
import { useState, useEffect } from "react"

export default function StatisticPage() {
    const [recommendedPartners, setRecommendedPartners] = useState([])

    const matchedPartners = recommendedPartners.filter((partner) =>
        receipts.some((receipt) => receipt.store === partner)
    )
    const matchedCount = matchedPartners.length

    useEffect(() => {
        const partners = totalCostByCategory
            .slice()
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .flatMap((category, sortedIndex) => {
                const partnersCount = 3 - sortedIndex
                return PARTNER_STORES.filter((store) => store.category === category.categoryName)
                    .slice(0, partnersCount)
                    .map((partner) => partner.name)
            })

        setRecommendedPartners(partners)
    }, [totalCostByCategory])

    // Для демонстрации работы (можно удалить)
    console.log("Рекомендованные партнёры:", recommendedPartners)

    return (
        <div>
            <Typography.Title style={{ margin: "24px" }} level={2}>
                Статистика по покупкам
            </Typography.Title>

            <div style={{ width: "100%", height: "300px", pointerEvents: "none" }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={totalCostByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={80} // Радиус отверстия (для пончика)
                            outerRadius={100} // Внешний радиус
                            fill="#8884d8"
                            paddingAngle={3} // Пространство между сегментами
                            dataKey="value" // Ключ данных для значений
                        >
                            <Label
                                value={"Всего: " + totalСost}
                                position="center"
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    fill: "#333",
                                }}
                            />
                            {totalCostByCategory.map((item, index) => (
                                <Cell key={`cell-${item.categoryName}`} fill={chartColors[index]} />
                            ))}
                        </Pie>

                        <Legend
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                            iconType="circle"
                            wrapperStyle={{
                                paddingLeft: "20px",
                            }}
                            payload={totalCostByCategory.map((item, index) => ({
                                value: `${item.categoryName} (${item.percentageOfTotal}%)`,
                                type: "circle",
                                color: chartColors[index],
                                id: item.categoryName,
                            }))}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <Divider variant="solid" style={{ borderColor: "#0958d9", fontSize: "20px" }}>
                Категории
            </Divider>
            {totalCostByCategory.map((element) => (
                <Card
                    key={element.categoryName}
                    style={{ width: "90vw", margin: "15px auto", fontSize: "25px" }}>
                    <Typography style={{ fontSize: "19px" }}>
                        {element.categoryName}: {element.value} ₽
                    </Typography>
                </Card>
            ))}

            <Divider variant="solid" style={{ borderColor: "#0958d9", fontSize: "20px" }}>
                Рекомендованные партнёры
            </Divider>
            {totalCostByCategory
                .slice()
                .sort((a, b) => b.value - a.value) // Сортируем по убыванию
                .slice(0, 3)
                .map((category, sortedIndex) => {
                    // Используем sortedIndex
                    const partnersCount = 3 - sortedIndex // 3 для 0, 2 для 1, 1 для 2
                    const partners = PARTNER_STORES.filter(
                        (store) => store.category === category.categoryName
                    ).slice(0, partnersCount)

                    // Получаем цвет из оригинального порядка
                    const originalIndex = totalCostByCategory.findIndex(
                        (c) => c.categoryName === category.categoryName
                    )
                    const categoryColor = chartColors[originalIndex]

                    return (
                        <div key={category.categoryName}>
                            <Typography.Title level={4} style={{ margin: "16px 24px", color: categoryColor }}>
                                {category.categoryName}
                            </Typography.Title>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                    gap: "16px",
                                    padding: "0 24px",
                                    marginBottom: "20px",
                                }}>
                                {partners.map((partner) => (
                                    <Card
                                        key={partner.shop_id}
                                        style={{
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                            backgroundColor: `${categoryColor}10`,
                                            borderLeft: `4px solid ${categoryColor}`,
                                        }}>
                                        <Card.Meta
                                            title={
                                                <span style={{ color: categoryColor }}>{partner.name}</span>
                                            }
                                        />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                })}

            {/* Отображает статистику рекомендаций, код для отладки */}
            <Divider variant="solid" style={{ borderColor: "#0958d9", fontSize: "20px" }}>
                Статистика рекомендаций
            </Divider>

            <Card style={{ margin: "16px 24px" }}>
                <Typography.Text>
                    Рекомендованных партнёров: {recommendedPartners.length}
                    <br />
                    Уже посещённых: {matchedCount}
                    <br />
                    Список совпадений: {matchedPartners.join(", ")}
                </Typography.Text>
            </Card>
        </div>
    )
}
