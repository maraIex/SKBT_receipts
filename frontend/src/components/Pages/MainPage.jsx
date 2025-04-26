/** @format */
import { Layout } from "antd"
import { Body } from "../Body"

const totalSpending = 12500 // Общие траты за месяц

const topCategories = [
    { name: "Продукты", amount: 6500 },
    { name: "Кафе", amount: 3200 },
    { name: "Транспорт", amount: 2800 },
]

const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 60,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4096ff",
}
const contentStyle = {
    textAlign: "center",
    minHeight: "calc(100vh - 120px)",
    color: "#fff",
    backgroundColor: "#0958d9",
}
const footerStyle = {
    height: 60,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#4096ff",
}

export default function MainPage({ onNavigate }) { // Принимаем пропс onNavigate
    return (
        <Layout.Content style={contentStyle}>
            <Body 
                totalSpending={totalSpending}
                topCategories={topCategories}
                onShowHistory={() => onNavigate("history")}
                onShowStatistics={() => onNavigate("statistic")}
            />
        </Layout.Content>
    )
}
