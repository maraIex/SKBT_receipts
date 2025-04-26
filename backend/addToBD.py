from datetime import datetime
from decimal import Decimal
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import TIMESTAMP, ForeignKey, String, Boolean, Numeric
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

app = FastAPI()

engine = create_async_engine('sqlite+aiosqlite:///receipts.db')

new_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_session():
    async with new_session() as session:
        yield session

class Base(DeclarativeBase):
    pass

class ShopModel(Base):
    __tablename__ = "Shops"

    shop_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_partner: Mapped[bool] = mapped_column(Boolean, default=False)

class CategoryModel(Base):
    __tablename__ = "Categories"

    category_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(25), nullable=False)

class ItemModel(Base):
    __tablename__ = "Items"

    item_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("Categories.category_id"))

class ReceiptModel(Base):
    __tablename__ = "Receipts"

    id: Mapped[int] = mapped_column(primary_key=True)
    operation_date: Mapped[datetime] = mapped_column(TIMESTAMP)
    shop_id: Mapped[int] = mapped_column(ForeignKey("Shops.shop_id"))

class ReceiptItemModel(Base):
    __tablename__ = "ReceiptItems"

    receipt_item_id: Mapped[int] = mapped_column(primary_key=True)
    receipt_id: Mapped[int] = mapped_column(ForeignKey("Receipts.id"), nullable=False)  # <-- ТУТ ИСПРАВЛЕНО
    item_id: Mapped[int] = mapped_column(ForeignKey("Items.item_id"), nullable=False)
    quantity: Mapped[int] = mapped_column(nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

class RecommendationModel(Base):
    __tablename__ = "Recommendations"

    recommendation_id: Mapped[int] = mapped_column(primary_key=True)
    receipt_id: Mapped[int] = mapped_column(ForeignKey("Receipts.id"))
    recommended_shop_id: Mapped[int] = mapped_column(ForeignKey("Shops.shop_id"))
    expected_savings: Mapped[Decimal] = mapped_column(Numeric(10, 2))

@app.post("/setup_database")
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}
