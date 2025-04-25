/** @format */
import { React, useState, useRef } from "react"
import { Layout, Button, Drawer } from "antd"
import { CameraOutlined } from "@ant-design/icons"
import Webcam from "react-webcam"

export default function AppHeader() {
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
                height: "6vh",
                justifyContent: "space-between",
            }}>
            <Button
                type="round"
                onClick={() => setShowCamera(true)}
                style={{ border: "1px solid black" }}
                size="large"
                icon={<CameraOutlined />}></Button>
            <Button type="primary" onClick={() => setDrawer(true)}>
                Меню
            </Button>

            <Drawer title="Basic Drawer" onClose={() => setDrawer(false)} open={drawer}>
                <Button type="text" block>
                    text
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
