"""add users table and reporter_user_id to incidents

Revision ID: a1b2c3d4e5f6
Revises: 6c922245c8e8
Create Date: 2026-04-03 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '6c922245c8e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=200), nullable=False),
        sa.Column('role', sa.Enum('reporter', 'coordinator', 'admin', name='role'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.add_column('incidents', sa.Column('reporter_user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_incidents_reporter_user_id', 'incidents', 'users', ['reporter_user_id'], ['id'])


def downgrade() -> None:
    op.drop_constraint('fk_incidents_reporter_user_id', 'incidents', type_='foreignkey')
    op.drop_column('incidents', 'reporter_user_id')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.execute("DROP TYPE IF EXISTS role")
