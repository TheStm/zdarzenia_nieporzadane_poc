"""empty message

Revision ID: 02e682753e75
Revises: 9bff1a82a5ee
Create Date: 2026-03-31 17:49:15.502957

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '02e682753e75'
down_revision: Union[str, Sequence[str], None] = '9bff1a82a5ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
