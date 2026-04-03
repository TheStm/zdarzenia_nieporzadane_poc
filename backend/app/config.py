from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://zdarzenia:zdarzenia_dev@localhost:5432/zdarzenia"
    app_name: str = "Zdarzenia Niepożądane API"
    jwt_secret: str = "dev-secret-change-in-production!!"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480

    model_config = {"env_file": ".env"}


settings = Settings()
