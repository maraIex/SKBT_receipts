/** @format */
import { Typography, Divider, Card } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Label } from "recharts"
import { chartColors, totalCostByCategory, totalCost, PARTNER_STORES, receipts } from "../../data"
import { useState, useEffect } from "react"

export default function StatisticPage() {
    const [recommendedPartners, setRecommendedPartners] = useState([])

    // Подсчёт совпавших партнёров (можно удалить если не используется)
    const matchedPartners = recommendedPartners.flatMap((group) =>
        group.partners.filter((partner) => receipts.some((receipt) => receipt.store === partner.name))
    )
    const matchedCount = matchedPartners.length

    useEffect(() => {
        const partnersByCategory = totalCostByCategory
            .slice()
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((category, sortedIndex) => {
                const originalIndex = totalCostByCategory.findIndex(
                    (c) => c.categoryName === category.categoryName
                )

                return {
                    category: category.categoryName,
                    partners: PARTNER_STORES.filter(
                        (store) => store.category === category.categoryName
                    ).slice(0, 3 - sortedIndex),
                    color: originalIndex >= 0 ? chartColors[originalIndex] : "#6c757d",
                }
            })

        setRecommendedPartners(partnersByCategory)
    }, [totalCostByCategory])

    return (
        <div>
            <Typography.Title style={{ margin: "24px" }} level={2}>
                Статистика по покупкам
            </Typography.Title>

            {/* Круговая диаграмма */}
            <div style={{ width: "100%", height: "300px", pointerEvents: "none" }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={totalCostByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={3}
                            dataKey="value">
                            <Label
                                value={"Всего: " + totalCost}
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

            {recommendedPartners.map((group) => (
                <div key={group.category}>
                    <Typography.Title level={4} style={{ margin: "16px 24px", color: group.color }}>
                        {group.category}
                    </Typography.Title>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "16px",
                            padding: "0 24px",
                            marginBottom: "20px",
                        }}>
                        {group.partners.map((partner) => (
                            <Card
                                key={partner.shop_id}
                                style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    backgroundColor: `${group.color}10`,
                                    borderLeft: `4px solid ${group.color}`,
                                }}>
                                <Card.Meta
                                    title={<span style={{ color: group.color }}>{partner.name}</span>}
                                />
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
