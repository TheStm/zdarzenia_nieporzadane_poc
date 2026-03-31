from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.models.rca import ActionItem, RCAAnalysis


def get_stats(db: Session) -> dict:
    total = db.query(func.count(Incident.id)).scalar() or 0

    by_status_rows = (
        db.query(Incident.status, func.count(Incident.id))
        .group_by(Incident.status)
        .all()
    )
    by_status = {str(row[0].value if hasattr(row[0], 'value') else row[0]): row[1] for row in by_status_rows}

    by_category_rows = (
        db.query(Incident.category, func.count(Incident.id))
        .group_by(Incident.category)
        .all()
    )
    by_category = {str(row[0].value if hasattr(row[0], 'value') else row[0]): row[1] for row in by_category_rows}

    by_severity_rows = (
        db.query(Incident.severity, func.count(Incident.id))
        .group_by(Incident.severity)
        .all()
    )
    by_severity = {str(row[0].value if hasattr(row[0], 'value') else row[0]): row[1] for row in by_severity_rows}

    by_month_rows = (
        db.query(
            extract("year", Incident.event_date).label("year"),
            extract("month", Incident.event_date).label("month"),
            func.count(Incident.id),
        )
        .group_by("year", "month")
        .order_by("year", "month")
        .all()
    )
    by_month = [
        {"year": int(row[0]), "month": int(row[1]), "count": row[2]}
        for row in by_month_rows
    ]

    # Open RCA analyses with incident info
    open_rcas = (
        db.query(RCAAnalysis, Incident)
        .join(Incident, RCAAnalysis.incident_id == Incident.id)
        .filter(RCAAnalysis.status != "completed")
        .order_by(RCAAnalysis.created_at.desc())
        .all()
    )
    rca_list = []
    for rca, incident in open_rcas:
        total_actions = db.query(func.count(ActionItem.id)).filter(ActionItem.rca_id == rca.id).scalar() or 0
        completed_actions = db.query(func.count(ActionItem.id)).filter(ActionItem.rca_id == rca.id, ActionItem.status == "completed").scalar() or 0
        rca_list.append({
            "rca_id": rca.id,
            "incident_id": incident.id,
            "rca_status": rca.status.value if hasattr(rca.status, 'value') else str(rca.status),
            "department": incident.department,
            "category": incident.category.value if hasattr(incident.category, 'value') else str(incident.category),
            "severity": incident.severity.value if hasattr(incident.severity, 'value') else int(incident.severity),
            "team_members": rca.team_members,
            "created_at": rca.created_at.isoformat(),
            "total_actions": total_actions,
            "completed_actions": completed_actions,
        })

    # Upcoming/overdue action items
    pending_actions = (
        db.query(ActionItem, RCAAnalysis, Incident)
        .join(RCAAnalysis, ActionItem.rca_id == RCAAnalysis.id)
        .join(Incident, RCAAnalysis.incident_id == Incident.id)
        .filter(ActionItem.status != "completed")
        .order_by(ActionItem.deadline)
        .limit(20)
        .all()
    )
    action_list = []
    for action, rca, incident in pending_actions:
        action_list.append({
            "action_id": action.id,
            "description": action.description,
            "responsible_person": action.responsible_person,
            "deadline": action.deadline.isoformat(),
            "status": action.status.value if hasattr(action.status, 'value') else str(action.status),
            "incident_id": incident.id,
            "department": incident.department,
        })

    # Recent incidents (activity feed)
    recent = (
        db.query(Incident)
        .order_by(Incident.created_at.desc())
        .limit(10)
        .all()
    )
    recent_list = [
        {
            "id": inc.id,
            "event_type": inc.event_type.value if hasattr(inc.event_type, 'value') else str(inc.event_type),
            "department": inc.department,
            "category": inc.category.value if hasattr(inc.category, 'value') else str(inc.category),
            "severity": inc.severity.value if hasattr(inc.severity, 'value') else int(inc.severity),
            "status": inc.status.value if hasattr(inc.status, 'value') else str(inc.status),
            "description": inc.description[:120] + "..." if len(inc.description) > 120 else inc.description,
            "created_at": inc.created_at.isoformat(),
        }
        for inc in recent
    ]

    return {
        "total": total,
        "by_status": by_status,
        "by_category": by_category,
        "by_severity": by_severity,
        "by_month": by_month,
        "open_rcas": rca_list,
        "pending_actions": action_list,
        "recent_incidents": recent_list,
    }
