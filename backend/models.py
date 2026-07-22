import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(320), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name            = Column(String(255), nullable=True)

    created_at      = Column(DateTime, default=datetime.datetime.utcnow)

    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    photos   = relationship("Photo",   back_populates="user", cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = "sessions"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    title      = Column(String(512), nullable=False)
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user   = relationship("User",    back_populates="sessions")
    photos = relationship("Photo",   back_populates="session", cascade="all, delete-orphan")

class Photo(Base):
    __tablename__ = "photos"

    id                 = Column(Integer, primary_key=True, index=True)
    user_id            = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id         = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    file_path          = Column(String(1024), nullable=False)
    title              = Column(String(512), nullable=True)
    description        = Column(Text, nullable=True)
    filter_name        = Column(String(128), default="none")
    is_flash_used      = Column(Boolean, default=False)
    is_flashlight_used = Column(Boolean, default=False)
    photo_order        = Column(Integer, default=0)
    is_downloaded      = Column(Boolean, default=False)
    strip_template_id  = Column(String(128), nullable=True)   # e.g. 'sunflower-scrap-3'
    created_at         = Column(DateTime, default=datetime.datetime.utcnow)

    user    = relationship("User",    back_populates="photos")
    session = relationship("Session", back_populates="photos")
