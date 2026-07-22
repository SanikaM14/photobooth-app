from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import datetime

# User schemas
class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None

    class Config:
        from_attributes = True

# Authentication schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=255)
    name: Optional[str] = Field(None, max_length=255)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(max_length=255)

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

# Photo schemas
class PhotoResponse(BaseModel):
    id: int
    url: str
    thumbnailUrl: str
    title: Optional[str] = None
    description: Optional[str] = None
    filterName: str
    isFlashUsed: bool
    isFlashlightUsed: bool
    sessionId: Optional[int] = None
    photoOrder: int
    isDownloaded: bool
    createdAt: datetime.datetime

    class Config:
        from_attributes = True

# Session schemas
class SessionCreate(BaseModel):
    sessionName: str

class SessionResponse(BaseModel):
    id: int
    title: str
    isActive: bool
    createdAt: datetime.datetime
    photos: List[PhotoResponse] = []

    class Config:
        from_attributes = True
