from datetime import datetime
from decimal import Decimal
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy import TIMESTAMP, ForeignKey, String, Boolean, Numeric, select, func
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
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
    receipt_id: Mapped[int] = mapped_column(ForeignKey("Receipts.id"), nullable=False)
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
        #await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}


@app.get("/receipts/{receipt_id}")
async def get_receipt(receipt_id: int, session: AsyncSession = Depends(get_session)):
    receipt_query = await session.execute(
        select(
            ReceiptModel.operation_date,
            ShopModel.name,
            ShopModel.is_partner
        )
        .join(ShopModel, ReceiptModel.shop_id == ShopModel.shop_id)
        .where(ReceiptModel.id == receipt_id)
    )
    receipt = receipt_query.first()

    if receipt is None:
        return {"error": "Receipt not found"}

    operation_date, store_name, is_partner = receipt

    items_query = await session.execute(
        select(ItemModel.name)
        .join(ReceiptItemModel, ItemModel.item_id == ReceiptItemModel.item_id)
        .where(ReceiptItemModel.receipt_id == receipt_id)
    )
    products = [row[0] for row in items_query.all()]

    amount_query = await session.execute(
        select(func.sum(ReceiptItemModel.price * ReceiptItemModel.quantity))
        .where(ReceiptItemModel.receipt_id == receipt_id)
    )
    amount = amount_query.scalar() or 0

    return {
        "products": products,
        "store": store_name,
        "date": operation_date.date().isoformat(),
        "amount": float(amount),
        "isPartner": is_partner
    }

@app.get("/get_all_products")
async def get_all_products(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(ReceiptItemModel, ItemModel, CategoryModel)
        .join(ItemModel, ReceiptItemModel.item_id == ItemModel.item_id)
        .join(CategoryModel, ItemModel.category_id == CategoryModel.category_id)
    )
    products = []
    for receipt_item, item, category in result.fetchall():
        products.append({
            "name": item.name,
            "category": category.name,
            "cost": str(int(receipt_item.price)),
            "quantity": str(receipt_item.quantity),
        })
    return products

@app.get("/get_partners")
async def get_partners(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(ShopModel).where(ShopModel.is_partner == True)
    )
    partners = []
    for shop in result.scalars():
        partners.append({
            "shop_id": shop.shop_id,
            "name": shop.name,
        })
    return partners

@app.get("/get_all_receipts")
async def get_all_receipts(session: AsyncSession = Depends(get_session)):
    receipts_data = await session.execute(
        select(
            ReceiptModel.id,
            ReceiptModel.operation_date,
            ShopModel.name,
            ShopModel.is_partner
        )
        .join(ShopModel, ReceiptModel.shop_id == ShopModel.shop_id)
    )
    receipts = receipts_data.fetchall()

    result = []
    for receipt in receipts:
        receipt_id, operation_date, shop_name, is_partner = receipt

        # Получаем товары для каждого чека
        items_data = await session.execute(
            select(ItemModel.name, ReceiptItemModel.price, ReceiptItemModel.quantity)
            .join(ItemModel, ReceiptItemModel.item_id == ItemModel.item_id)
            .where(ReceiptItemModel.receipt_id == receipt_id)
        )
        items = items_data.fetchall()

        product_names = []
        total_amount = 0

        for item_name, price, quantity in items:
            product_names.append(item_name)
            total_amount += int(price) * quantity

        result.append({
            "products": product_names,
            "store": shop_name,
            "date": operation_date.strftime("%Y-%m-%d"),
            "amount": total_amount,
            "isPartner": is_partner
        })

    return result