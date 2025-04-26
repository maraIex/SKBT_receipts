/** @format */
import { Card, Row, Col, Statistic, List, Button } from "antd"
import { PieChartOutlined, ShoppingCartOutlined, ScanOutlined, HistoryOutlined } from "@ant-design/icons"
import { useState, useRef } from "react"
import HistoryPage from "./Pages/HistoryPage"
import { colors } from "../colors"
import { mockReceipts } from '../receipts';
import Webcam from "react-webcam"

export const Body = ({ 
    totalSpending,
    topCategories,
    onShowHistory,
    onShowStatistics,
    showCamera,
    setShowCamera
}) => {
    //const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);
    const scannedReceiptsCount = mockReceipts.length; // Добавлено определение

    const capturePhoto = () => {
        if (webcamRef.current) {
            const photo = webcamRef.current.getScreenshot()
            console.log(photo) // base64-строка
            setShowCamera(false) // Закрываем камеру после съёмки
        }
    }

    const handleShowStats = (receiptId) => {
        console.log("Показать статистику для чека:", receiptId)
        // Здесь можно открыть модальное окно с диаграммой
    }

    return (
        <>
            {/* Основной контент */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <Card title="Общая статистика">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title="Траты за месяц"
                                    value={totalSpending}
                                    precision={0}
                                    suffix="₽"
                                />
                            </Col>
                            <Col span={12}>
                                <div 
                                    onClick={onShowStatistics}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Statistic
                                        title="Отсканировано чеков"
                                        value={scannedReceiptsCount}
                                        prefix={<ScanOutlined />}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col span={24}>
                    <Card title="Топ-3 категории">
                        <List
                            dataSource={topCategories}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<ShoppingCartOutlined />}
                                        title={item.name}
                                        description={`${item.amount} ₽`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={12} style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ScanOutlined />}
                        onClick={() => setShowCamera(true)}
                        block>
                        Сканировать чек
                    </Button>
                </Col>
                <Col span={12} style={{ textAlign: "center" }}>
                    <Button
                        type="default"
                        size="large"
                        icon={<HistoryOutlined />}
                        onClick={onShowHistory}  // Используем переданный колбэк
                        block>
                        История
                    </Button>
                </Col>
            </Row>

            {/* Модальное окно камеры */}
            {showCamera && (
                <div style={{
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
                        <Button 
                            onClick={() => setShowCamera(false)} 
                            style={{ marginLeft: 10 }}>
                            Отмена
                        </Button>
                    </div>
                </div>
            )}
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
        </>
    );
};