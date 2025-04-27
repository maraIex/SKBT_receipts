/** @format */
import { Layout } from "antd"
import React, { useEffect, useState } from "react"
import AppHeader from "./components/AppHeader"
import MainPage from "./components/Pages/MainPage"
import HistoryPage from "./components/Pages/HistoryPage"
import StatisticPage from "./components/Pages/StatisticPage"
import RecommendationsPage from "./components/Pages/RecommendationsPage"

function App() {
    const [page, setPage] = useState("main")
    const [showCamera, setShowCamera] = useState(false)

    return (
        <Layout>
            <AppHeader
                currentPage={page}
                onPageChange={setPage}
                showCamera={showCamera}
                setShowCamera={setShowCamera}
            />

            <Layout.Content style={{ padding: 0, background: "#fff" }}>
                {page === "main" && (
                    <MainPage onNavigate={setPage} showCamera={showCamera} setShowCamera={setShowCamera} />
                )}
                {page === "history" && <HistoryPage />}
                {page === "statistic" && <StatisticPage />}
                {page === "recommendations" && <RecommendationsPage onBack={() => setPage("main")} />}
            </Layout.Content>
        </Layout>
    )
}

export default App
