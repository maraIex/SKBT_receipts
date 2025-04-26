/** @format */
import { useState, useRef } from "react"
import { Layout, Button, Drawer, Image } from "antd"
import { CameraOutlined } from "@ant-design/icons"
import logo from "/logo-name.svg"
import Webcam from "react-webcam"

export default function AppHeader({ onPageChange }) {
    const [drawer, setDrawer] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const webcamRef = useRef(null)

    const capturePhoto = () => {
        if (webcamRef.current) {
            const photo = webcamRef.current.getScreenshot()
            console.log(photo) // base64-строка
            setShowCamera(false) // Закрываем камеру после съёмки
        }
    }

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
                <Button
                    type="round"
                    onClick={() => setShowCamera(true)}
                    style={{ border: "1px solid black", marginRight: "20px" }}
                    size="large"
                    icon={<CameraOutlined />}
                />
                <Button type="primary" onClick={() => setDrawer(true)}>
                    Меню
                </Button>
            </div>

            <Drawer title="Вкладки" onClose={() => setDrawer(false)} open={drawer}>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                    }}
                    type="text"
                    block
                    onClick={() => menuClick("main")}>
                    Главная
                </Button>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                    }}
                    type="text"
                    block
                    onClick={() => {
                        setShowCamera(true)
                        setDrawer(false)
                    }}>
                    Сканировать чек
                </Button>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                    }}
                    type="text"
                    block
                    onClick={() => menuClick("history")}>
                    История чеков
                </Button>
                <Button
                    style={{
                        borderBottom: "1px solid black",
                        borderRadius: 0,
                        height: "7vh",
                        WebkitTapHighlightColor: "transparent",
                    }}
                    type="text"
                    block
                    onClick={() => menuClick("statistic")}>
                    Статистика расходов
                </Button>
                <Button
                    style={{ borderRadius: 0, height: "7vh", WebkitTapHighlightColor: "transparent" }}
                    type="text"
                    block
                    onClick={() => menuClick("recommendations")}>
                    Рекомендации
                </Button>
            </Drawer>

            {showCamera && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.9)",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        style={{ maxWidth: "100%" }}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button onClick={capturePhoto} type="primary">
                            Сделать фото
                        </Button>
                        <Button onClick={() => setShowCamera(false)} style={{ marginLeft: 10 }}>
                            Отмена
                        </Button>
                    </div>
                </div>
            )}
        </Layout.Header>
    )
}
