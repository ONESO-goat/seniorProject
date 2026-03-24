from datetime import datetime
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    member_since: datetime


class Posted_contentCreate(BaseModel):
    title: str
    description: str

class Posted_contentOut(BaseModel):
    id: str
    title: str
    created_at: datetime
