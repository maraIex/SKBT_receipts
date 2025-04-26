/** @format */
import { Card, List, Button, Tag, Row, Col, Modal, Divider } from "antd"
import { ShopOutlined, CalendarOutlined, PieChartOutlined } from "@ant-design/icons"
import { colors } from "../../colors"
import { receipts, PARTNER_STORES } from "../../data"
import { useState } from "react"

export default function HistoryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedReceipt, setSelectedReceipt] = useState(null)
    const cardStyles = {
        partner: {
            borderLeft: `4px solid ${colors.muted_green}`,
            backgroundColor: "#f6ffed",
        },
        regular: {
            borderLeft: "4px solid #d9d9d9",
        },
        cardBody: {
            padding: "12px",
        },
        titleContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
        leftTitle: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        amountText: {
            fontWeight: "bold",
            minWidth: "80px",
            textAlign: "right",
        },
    }

    return (
        <div style={{ padding: "0 16px" }}>
            <List
                dataSource={receipts}
                renderItem={(receipt) => (
                    <List.Item style={{ padding: "4px 0" }}>
                        <Card
                            title={
                                <div style={cardStyles.titleContainer}>
                                    <div style={cardStyles.leftTitle}>
                                        <span>Чек №{receipt.id}</span>
                                        {PARTNER_STORES.includes(receipt.store) && (
                                            <Tag color="success" style={{ margin: 0 }}>
                                                Партнёр
                                            </Tag>
                                        )}
                                    </div>
                                    <span style={cardStyles.amountText}>{receipt.amount} ₽</span>
                                </div>
                            }
                            style={{
                                width: "100%",
                                ...(PARTNER_STORES.includes(receipt.store)
                                    ? cardStyles.partner
                                    : cardStyles.regular),
                            }}
                            styles={{ body: cardStyles.cardBody }}
                            size="small">
                            <Row gutter={8}>
                                <Col flex="none">
                                    <ShopOutlined />
                                </Col>
                                <Col flex="auto">{receipt.store}</Col>
                            </Row>
                            <Row gutter={8} style={{ marginTop: "4px" }}>
                                <Col flex="none">
                                    <CalendarOutlined />
                                </Col>
                                <Col flex="auto">{new Date(receipt.date).toLocaleDateString()}</Col>
                            </Row>
                            <Button
                                type="link"
                                icon={<PieChartOutlined />}
                                onClick={() => {
                                    setIsModalOpen(true)
                                    setSelectedReceipt(receipt) // Исправлено: было setSelectedReceipt
                                }}
                                style={{
                                    padding: "0",
                                    height: "auto",
                                    marginTop: "8px",
                                }}>
                                Подробнее о чеке
                            </Button>
                        </Card>
                    </List.Item>
                )}
            />

            {/* Модальное окно вынесено за пределы List */}
            <Modal
                closeIcon={false}
                title={
                    <span style={{ fontSize: "24px", display: "flex", alignItems: "center" }}>
                        Чек №{selectedReceipt?.id || ""}
                        {PARTNER_STORES.includes(selectedReceipt?.store) && (
                            <Tag
                                color="success"
                                style={{
                                    marginLeft: "12px",
                                    fontSize: "16px",
                                    padding: "4px 8px",
                                    height: "auto",
                                }}>
                                Партнёр
                            </Tag>
                        )}
                    </span>
                }
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                footer={[
                    <Button
                        key="ok"
                        type="primary"
                        onClick={() => setIsModalOpen(false)}
                        style={{ width: "100%" }}>
                        Закрыть
                    </Button>,
                ]}>
                {selectedReceipt && (
                    <>
                        <div style={{ marginBottom: "16px" }}>
                            <p style={{ fontSize: "16px" }}>
                                <strong>Магазин:</strong> {selectedReceipt.store}
                            </p>

                            <Divider style={{ margin: "16px 0" }} />

                            <div>
                                <h4 style={{ fontSize: "18px", marginBottom: "12px" }}>Купленные товары:</h4>
                                <ul
                                    style={{
                                        margin: 0,
                                        paddingLeft: "20px",
                                        listStyleType: "none",
                                    }}>
                                    {selectedReceipt.products.map((product, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                fontSize: "16px",
                                                margin: "8px 0",
                                                display: "flex",
                                                alignItems: "center",
                                            }}>
                                            <span style={{ marginRight: "8px" }}>•</span>
                                            {product}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Divider style={{ margin: "0" }} />

                            <p style={{ fontSize: "16px", margin: "8px 0" }}>
                                <strong>Сумма:</strong> {selectedReceipt.amount.toLocaleString()} ₽
                            </p>
                            <p style={{ fontSize: "16px", margin: "8px 0" }}>
                                <strong>Дата:</strong> {new Date(selectedReceipt.date).toLocaleDateString()}
                            </p>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}
