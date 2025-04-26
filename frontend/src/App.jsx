/** @format */
    //return (
    //    <Content style={contentStyle}>
    //      <Body
    //        totalSpending={totalSpending} 
    //        topCategories={topCategories} 
    //      />
    //    </Content>
    //);
import { Layout } from "antd"
import { useState } from "react"
import AppHeader from "./components/AppHeader"
import MainPage from "./components/Pages/MainPage"
import HistoryPage from "./components/Pages/HistoryPage"
import StatisticPage from "./components/Pages/StatisticPage"
import RecommendationsPage from "./components/Pages/RecommendationsPage"

function App() {
    const [page, setPage] = useState("statistic")
    
    const totalSpending = 12500; // Общие траты за месяц
    const topCategories = [
      { name: "Продукты", amount: 6500 },
      { name: "Кафе", amount: 3200 },
      { name: "Транспорт", amount: 2800 },
    ];

    return (
        <>
            <Layout>
                <AppHeader currentPage={page} onPageChange={setPage} />

                <Layout.Content
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: "#fff",
                    }}>
                    {page === "main" && <MainPage />}
                    {page === "history" && <HistoryPage />}
                    {page === "statistic" && <StatisticPage />}
                    {page === "recommendations" && <RecommendationsPage />}
                </Layout.Content>

                <Layout.Footer style={{ textAlign: "center" }}>Created by command Dark Mode</Layout.Footer>
            </Layout>
        </>
    )
}

export default App
