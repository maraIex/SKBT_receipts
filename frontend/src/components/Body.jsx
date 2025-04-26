/** @format */
import { Card, Row, Col, Statistic, List, Button } from "antd"
import { ShoppingCartOutlined, ScanOutlined, HistoryOutlined } from "@ant-design/icons"
import Camera from "./Camera"
import { mockReceipts } from "../receipts"
import { topThreeCategories, totalСost } from "../data"

export const Body = ({ onShowHistory, onShowStatistics, showCamera, setShowCamera }) => {
    //const [showCamera, setShowCamera] = useState(false);
    const scannedReceiptsCount = mockReceipts.length

    const handleShowStats = (receiptId) => {
        console.log("Показать статистику для чека:", receiptId)
        // Здесь можно открыть модальное окно с диаграммой
    }

    return (
        <>
            {/* Основной контент */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col span={24}>
                    <Card title="Общая статистика">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title="Траты за месяц"
                                    value={totalСost}
                                    precision={0}
                                    suffix="₽"
                                />
                            </Col>
                            <Col span={12}>
                                <div onClick={onShowStatistics} style={{ cursor: "pointer" }}>
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
                            dataSource={topThreeCategories}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<ShoppingCartOutlined />}
                                        title={item.categoryName}
                                        description={`${item.value} ₽`}
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
                        style={{ WebkitTapHighlightColor: "transparent" }}
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
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        icon={<HistoryOutlined />}
                        onClick={onShowHistory} // Используем переданный колбэк
                        block>
                        История
                    </Button>
                </Col>
            </Row>

            {showCamera && <Camera setShowCamera={setShowCamera} />}
        </>
    )
}
