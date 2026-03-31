from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://zdarzenia:zdarzenia_dev@localhost:5432/zdarzenia"
    app_name: str = "Zdarzenia Niepożądane API"

    model_config = {"env_file": ".env"}


settings = Settings()
