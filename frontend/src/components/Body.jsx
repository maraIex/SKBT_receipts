    /** @format */
    import { Card, Row, Col, Statistic, List, Button } from "antd"
    import { PieChartOutlined, ShoppingCartOutlined, ScanOutlined, HistoryOutlined } from "@ant-design/icons"
    import { useState } from "react"
    import HistoryPage from "./Pages/HistoryPage"
    import { colors } from "../colors"

    import { mockReceipts } from '../receipts';

    export const Body = ({ 
        totalSpending, 
        topCategories,
        onShowHistory,       // Колбэк для перехода на историю
        onShowStatistics     // Колбэк для перехода на статистику
    }) => {
        const scannedReceiptsCount = mockReceipts.length;

        return (
            <>
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

                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
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
                    <Col span={12} style={{ textAlign: 'center' }}>
                        <Button 
                            type="primary" 
                            size="large" 
                            icon={<ScanOutlined />}
                            onClick={() => console.log('Сканирование чека')}
                            block
                        >
                            Сканировать чек
                        </Button>
                    </Col>
                    <Col span={12} style={{ textAlign: 'center' }}>
                        <Button 
                            type="default" 
                            size="large" 
                            icon={<HistoryOutlined />}
                            onClick={onShowHistory}
                            block
                        >
                            История
                        </Button>
                    </Col>
                </Row>
            </>
        );
    };
