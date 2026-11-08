from sqlalchemy import Boolean, Column, Integer, String

from app.database import Base


class ItemModel(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, unique=True, index=True)
    descricao = Column(String, nullable=True)
    concluida = Column(Boolean, default=False, nullable=False)