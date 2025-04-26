/** @format */
import { Body } from "../Body"

const totalSpending = 12500 // Общие траты за месяц

const topCategories = [
    { name: "Продукты", amount: 6500 },
    { name: "Кафе", amount: 3200 },
    { name: "Транспорт", amount: 2800 },
]
const contentStyle = {
    textAlign: "center",
    minHeight: "calc(100vh - 60px)",
    color: "#fff",
    padding: "20px",
    backgroundColor: "#0958d9",
}


export default function MainPage({ onNavigate, showCamera, setShowCamera }) {
    return (
        <div style={contentStyle}>
            <Body 
                totalSpending={totalSpending}
                topCategories={topCategories}
                onShowHistory={() => onNavigate("history")}
                onShowStatistics={() => onNavigate("statistic")}
                showCamera={showCamera}
                setShowCamera={setShowCamera}
            />
        </div>
    )
}
