/** @format */
import { Typography, Divider, Card } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Label } from "recharts"
import { chartColors, totalCostByCategory, totalСost } from "../../data"

export default function StatisticPage() {
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
                                <Cell
                                    key={`cell-${item.categoryName}`}
                                    fill={
                                        chartColors[
                                            (index + Math.floor(index / chartColors.length)) %
                                                chartColors.length
                                        ]
                                    }
                                />
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
                                color: chartColors[index % chartColors.length],
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
                        {element.categoryName}: {element.value}
                    </Typography>
                </Card>
            ))}
        </div>
    )
}
