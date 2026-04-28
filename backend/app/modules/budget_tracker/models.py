from typing import Optional
from sqlalchemy import String, Text, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.models import Base, BaseMixin

class ActualCostLine(Base, BaseMixin):
    """Realized costs for a project — compared against quotations."""
    
    __tablename__ = "actual_cost_lines"
    
    project_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    label: Mapped[str] = mapped_column(String(300), nullable=False)
    
    actual_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    currency: Mapped[str] = mapped_column(String(10), default="MAD")
    
    notes: Mapped[Optional[str]] = mapped_column(Text)
    
    # Optional link to a specific quotation line if available
    quotation_line_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    def __repr__(self) -> str:
        return f"<ActualCostLine(category='{self.category}', actual={self.actual_cost})>"
