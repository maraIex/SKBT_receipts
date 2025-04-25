/** @format */
import { Layout } from "antd"
import { useState } from "react"
import AppHeader from "./components/AppHeader"
import MainPage from "./components/Pages/MainPage"
import HistoryPage from "./components/Pages/HistoryPage"
import StatisticPage from "./components/Pages/StatisticPage"
import RecommendationsPage from "./components/Pages/RecommendationsPage"

const items = Array.from({ length: 3 }).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
}))

function App() {
    const [page, setPage] = useState("main")

    return (
        <>
            <Layout>
                <AppHeader currentPage={page} onPageChange={setPage} />

                <Layout.Content
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: "#fff"
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
