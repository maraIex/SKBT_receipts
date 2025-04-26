/** @format */
import { Layout } from "antd"
import { useState } from "react"
import AppHeader from "./components/AppHeader"
import MainPage from "./components/Pages/MainPage"
import HistoryPage from "./components/Pages/HistoryPage"
import StatisticPage from "./components/Pages/StatisticPage"
import RecommendationsPage from "./components/Pages/RecommendationsPage"
import { mockReceipts } from './receipts';

function App() {
    const [page, setPage] = useState("main")
    const [showCamera, setShowCamera] = useState(false)

    return (
        <Layout>
            <AppHeader 
                currentPage={page} 
                onPageChange={setPage}
                setShowCamera={setShowCamera}
            />

            <Layout.Content style={{ padding: 0, background: "#fff" }}>
                {page === "main" && (
                    <MainPage 
                        onNavigate={setPage}
                        showCamera={showCamera}
                        setShowCamera={setShowCamera}
                    />
                )}
                {page === "history" && (
                    <HistoryPage 
                        receipts={mockReceipts} 
                        onBack={() => setPage("main")}
                    />
                )}
                {page === "statistic" && <StatisticPage />}
                {page === "recommendations" && (
                    <RecommendationsPage onBack={() => setPage("main")} />
                )}
            </Layout.Content>

            <Layout.Footer style={{ textAlign: "center" }}>
                Created by Dark Mode
            </Layout.Footer>
        </Layout>
    )
}

export default App