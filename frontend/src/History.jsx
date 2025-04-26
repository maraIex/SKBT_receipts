/** @format */
import { Card, List, Button, Tag, Row, Col } from "antd";
import { 
  ShopOutlined, 
  CalendarOutlined, 
  PieChartOutlined,
  HistoryOutlined 
} from "@ant-design/icons";

const PARTNER_STORES = ["Пятёрочка", "Магнит", "Лента", "Перекрёсток"];

export const History = ({ receipts, onBack, onShowStats }) => {
  // Стили для карточек
  const cardStyles = {
    partner: {
      borderLeft: '4px solid #52c41a',
      backgroundColor: '#f6ffed',
    },
    regular: {
      borderLeft: '4px solid #d9d9d9',
    },
    cardBody: {
      padding: '12px'
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={24}>
          <Button 
            type="text" 
            icon={<HistoryOutlined />}
            onClick={onBack}
          >
            Назад к статистике
          </Button>
        </Col>
      </Row>

      <List
        dataSource={receipts}
        renderItem={(receipt) => (
          <List.Item style={{ padding: '4px 0' }}>
            <Card 
              title={
                <Row justify="space-between" align="middle">
                  <Col>Чек №{receipt.id}</Col>
                  <Col style={{ fontWeight: 'bold' }}>{receipt.amount} ₽</Col>
                </Row>
              }
              style={{
                width: '100%',
                ...(PARTNER_STORES.includes(receipt.store) 
                  ? cardStyles.partner 
                  : cardStyles.regular)
              }}
              bodyStyle={cardStyles.cardBody}
              extra={PARTNER_STORES.includes(receipt.store) && (
                <Tag color="success" style={{ marginLeft: 8 }}>Партнёр</Tag>
              )}
              size="small"
            >
              <Row gutter={8}>
                <Col flex="none">
                  <ShopOutlined />
                </Col>
                <Col flex="auto">
                  {receipt.store}
                </Col>
              </Row>
              <Row gutter={8} style={{ marginTop: '4px' }}>
                <Col flex="none">
                  <CalendarOutlined />
                </Col>
                <Col flex="auto">
                  {new Date(receipt.date).toLocaleDateString()}
                </Col>
              </Row>
              <Button 
                type="link" 
                icon={<PieChartOutlined />}
                onClick={() => onShowStats(receipt.id)}
                style={{ 
                  padding: '0',
                  height: 'auto',
                  marginTop: '8px'
                }}
              >
                Посмотреть статистику
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};