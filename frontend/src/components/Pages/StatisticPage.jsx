/** @format */
import { useState } from "react"
import { Typography } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { chartData, chartColors } from "../../data"

export default function StatisticPage() {
    return (
        <div>
            <Typography.Title level={2}>Статистика по покупкам</Typography.Title>

            <div style={{ width: "100%", height: "300px", pointerEvents: "none" }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80} // Радиус отверстия (для пончика)
                            outerRadius={100} // Внешний радиус
                            fill="#8884d8"
                            paddingAngle={3} // Пространство между сегментами
                            dataKey="value" // Ключ данных для значений
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Pie>
                        <Legend
                            layout="horizontal" // Горизонтальное или вертикальное расположение
                            align="center" // Выравнивание (left, center, right)
                            verticalAlign="bottom" // Вертикальное выравнивание (top, middle, bottom)
                            iconType="circle" // Тип иконок (circle, rect, cross и т.д.)
                            wrapperStyle={{
                                // Стили контейнера
                                paddingLeft: "20px", // Отступ от графика
                            }}
                            payload={chartData.map((item, index) => ({
                                value: `${item.name} ${item.value}%`, // Полный контроль над текстом
                                type: 'circle',                       // Тип иконки
                                color: chartColors[index],                 // Цвет
                                id: item.name                         // Уникальный ключ
                              }))}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
