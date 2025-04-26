/** @format */
import { useState } from "react"
import { Layout, Button, Drawer, Image } from "antd"
import { HomeOutlined, ScanOutlined, HistoryOutlined, PieChartOutlined } from "@ant-design/icons"
import logo from "/logo-name.svg"

export default function AppHeader({ onPageChange }) {
    const [drawer, setDrawer] = useState(false)

    function menuClick(type) {
        onPageChange(type)
        setDrawer(false)
    }

    return (
        <Layout.Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                background: "#fff",
                padding: 10,
                height: "7vh",
                justifyContent: "space-between",
            }}>
            <Image
                src={logo}
                style={{
                    display: "block",
                    alignSelf: "center",
                }}
                preview={false}
                width={120}
                height={32}
                alt="Логотип"
            />

            <div>
                <Button type="primary" onClick={() => setDrawer(true)}>
                    Меню
                </Button>
            </div>

            <Drawer title="Вкладки" style={{fontSize: "40px"}} onClose={() => setDrawer(false)} open={drawer}>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                        fontSize: "18px",
                        justifyContent: "start",
                        paddingLeft: "20px",
                    }}
                    type="text"
                    block
                    onClick={() => menuClick("main")}>
                    <HomeOutlined style={{ marginRight: "10px", fontSize: "20px"}}/>
                    Главная
                </Button>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                        fontSize: "18px",
                        justifyContent: "start",
                        paddingLeft: "20px",
                    }}
                    type="text"
                    block
                    onClick={() => {
                        setShowCamera(true)
                        setDrawer(false)
                    }}>
                    <ScanOutlined style={{ marginRight: "10px", fontSize: "20px"}}/>
                    Сканировать чек
                </Button>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                        fontSize: "18px",
                        justifyContent: "start",
                        paddingLeft: "20px",
                    }}
                    type="text"
                    block
                    onClick={() => menuClick("history")}>
                    <HistoryOutlined style={{ marginRight: "10px", fontSize: "20px"}}/>
                    История чеков
                </Button>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                        fontSize: "18px",
                        justifyContent: "start",
                        paddingLeft: "20px",
                    }}
                    type="text"
                    block
                    onClick={() => menuClick("statistic")}>
                    <PieChartOutlined style={{ marginRight: "10px", fontSize: "20px"}}/>
                    Статистика расходов
                </Button>
            </Drawer>
        </Layout.Header>
    )
}
