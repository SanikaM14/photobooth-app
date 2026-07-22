import os
import uuid
import datetime
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.config import UPLOAD_DIR, DEBUG
from backend.database import engine, get_db
from backend import models, schemas, auth
from sqlalchemy import func
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Rose Photobooth API")

if not DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)

# Add CORS Middleware to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")), name="static")

# Helper to format photo object for API response
def format_photo_response(photo: models.Photo, base_url: str) -> dict:
    filename = os.path.basename(photo.file_path)
    url = f"{base_url}static/uploads/{filename}"
    return {
        "id": photo.id,
        "url": url,
        "thumbnailUrl": url,
        "title": photo.title,
        "description": photo.description,
        "filterName": photo.filter_name,
        "isFlashUsed": photo.is_flash_used,
        "isFlashlightUsed": photo.is_flashlight_used,
        "sessionId": photo.session_id,
        "photoOrder": photo.photo_order,
        "isDownloaded": photo.is_downloaded,
        "stripTemplateId": photo.strip_template_id,
        "createdAt": photo.created_at
    }

# ----------------- AUTH ENDPOINTS -----------------
import time
from collections import defaultdict

# Simple in-memory rate limiter (max 5 attempts per 15 mins per IP)
# In production, use Redis.
login_attempts = defaultdict(list)

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Clean up old attempts (older than 15 mins)
    login_attempts[client_ip] = [t for t in login_attempts[client_ip] if now - t < 900]
    
    if len(login_attempts[client_ip]) >= 5:
        raise HTTPException(status_code=429, detail="Too many login attempts. Please try again later.")

def record_failed_login(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    login_attempts[client_ip].append(time.time())

@app.post("/api/auth/register", response_model=schemas.TokenResponse)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    email_lower = payload.email.strip().lower()
    # Check if email is already registered (case-insensitive)
    existing_user = db.query(models.User).filter(func.lower(models.User.email) == email_lower).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_password = auth.get_password_hash(payload.password)
    user = models.User(
        email=email_lower,
        name=(payload.name or email_lower.split('@')[0]).strip(),
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"token": access_token, "user": user}

@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login_user(request: Request, payload: schemas.UserLogin, db: Session = Depends(get_db)):
    check_rate_limit(request)
    
    email_lower = payload.email.strip().lower()
    user = db.query(models.User).filter(func.lower(models.User.email) == email_lower).first()
    
    if not user or not auth.verify_password(payload.password, user.hashed_password):
        record_failed_login(request)
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"token": access_token, "user": user}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/api/auth/logout")
def logout():
    return {"status": "success", "message": "Successfully logged out"}

@app.post("/api/auth/dev-bypass", response_model=schemas.TokenResponse)
def dev_bypass_login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    """Development-only bypass: creates/retrieves a guest user."""
    from backend.config import DEBUG
    if not DEBUG:
        raise HTTPException(status_code=403, detail="Dev bypass is disabled in production")

    email = "guest@rosephotobooth.dev"
    name = "Rose Guest"
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        hashed_password = auth.get_password_hash("guestpass")
        user = models.User(email=email, name=name, hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"token": access_token, "user": user}


# ----------------- SESSION ENDPOINTS -----------------

@app.post("/api/sessions", response_model=schemas.SessionResponse)
def create_session(
    payload: schemas.SessionCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    session = models.Session(
        user_id=current_user.id,
        title=payload.sessionName
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Return formatted session
    return {
        "id": session.id,
        "title": session.title,
        "isActive": session.is_active,
        "createdAt": session.created_at,
        "photos": []
    }

@app.put("/api/sessions/{session_id}/end", response_model=schemas.SessionResponse)
def end_session(
    session_id: int,
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.Session).filter(
        models.Session.id == session_id,
        models.Session.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
        
    session.is_active = False
    db.commit()
    db.refresh(session)
    
    base_url = str(request.base_url)
    photos = [format_photo_response(p, base_url) for p in session.photos]
    
    return {
        "id": session.id,
        "title": session.title,
        "isActive": session.is_active,
        "createdAt": session.created_at,
        "photos": photos
    }

@app.post("/api/sessions/{session_id}/claim")
def claim_session(
    session_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
        
    session.user_id = current_user.id
    
    photos = db.query(models.Photo).filter(models.Photo.session_id == session_id).all()
    for photo in photos:
        photo.user_id = current_user.id
        
    db.commit()
    return {"status": "success", "claimed_photos": len(photos)}

@app.get("/api/sessions", response_model=List[schemas.SessionResponse])
def get_user_sessions(
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(models.Session).filter(
        models.Session.user_id == current_user.id
    ).order_by(models.Session.created_at.desc()).all()
    
    base_url = str(request.base_url)
    
    response = []
    for s in sessions:
        photos = [format_photo_response(p, base_url) for p in s.photos]
        response.append({
            "id": s.id,
            "title": s.title,
            "isActive": s.is_active,
            "createdAt": s.created_at,
            "photos": photos
        })
        
    return response

# ----------------- PHOTO ENDPOINTS -----------------

@app.post("/api/photos/upload")
async def upload_photo(
    request: Request,
    photo: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    filterApplied: str = Form("none"),
    isFlashUsed: str = Form("false"),
    isFlashlightUsed: str = Form("false"),
    sessionId: Optional[str] = Form(None),
    photoOrder: int = Form(0),
    stripTemplateId: Optional[str] = Form(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Parse booleans from form strings
    flash_used = isFlashUsed.lower() == "true"
    flashlight_used = isFlashlightUsed.lower() == "true"
    
    # Parse optional session ID
    session_id_int = None
    if sessionId and sessionId != "" and sessionId != "null" and sessionId != "undefined":
        try:
            session_id_int = int(sessionId)
        except ValueError:
            pass

    # Generate a unique file name
    file_ext = os.path.splitext(photo.filename)[1] or ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the file
    with open(dest_path, "wb") as buffer:
        content = await photo.read()
        buffer.write(content)
        
    # Create the Photo model
    db_photo = models.Photo(
        user_id=current_user.id,
        session_id=session_id_int,
        file_path=dest_path,
        title=title,
        description=description,
        filter_name=filterApplied,
        is_flash_used=flash_used,
        is_flashlight_used=flashlight_used,
        photo_order=photoOrder,
        is_downloaded=False,
        strip_template_id=stripTemplateId
    )
    
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    
    # Return formatted response
    base_url = str(request.base_url)
    return format_photo_response(db_photo, base_url)

@app.get("/api/photos", response_model=List[schemas.PhotoResponse])
def get_user_photos(
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    photos = db.query(models.Photo).filter(
        models.Photo.user_id == current_user.id
    ).order_by(models.Photo.created_at.desc()).all()
    
    base_url = str(request.base_url)
    return [format_photo_response(p, base_url) for p in photos]

@app.get("/api/photos/downloaded", response_model=List[schemas.PhotoResponse])
def get_downloaded_photos(
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Wait, the app currently fetches "getDownloadedPhotos" on the gallery page.
    # To make sure photos actually show up, we return photos where is_downloaded = True.
    # If the user has just uploaded photos, they are marked is_downloaded = True by the frontend.
    # Let's verify this flow. Yes, in preview page, it uploads, then calls markAsDownloaded.
    photos = db.query(models.Photo).filter(
        models.Photo.user_id == current_user.id,
        models.Photo.is_downloaded == True
    ).order_by(models.Photo.created_at.desc()).all()
    
    base_url = str(request.base_url)
    return [format_photo_response(p, base_url) for p in photos]

@app.post("/api/photos/{photo_id}/download")
def mark_as_downloaded(
    photo_id: int,
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    photo = db.query(models.Photo).filter(
        models.Photo.id == photo_id,
        models.Photo.user_id == current_user.id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
        
    photo.is_downloaded = True
    db.commit()
    db.refresh(photo)
    
    base_url = str(request.base_url)
    return format_photo_response(photo, base_url)

@app.delete("/api/photos/{photo_id}")
def delete_photo(
    photo_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    photo = db.query(models.Photo).filter(
        models.Photo.id == photo_id,
        models.Photo.user_id == current_user.id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
        
    # Delete the actual file from disk
    if os.path.exists(photo.file_path):
        try:
            os.remove(photo.file_path)
        except Exception:
            pass
            
    db.delete(photo)
    db.commit()
    
    return {"status": "success", "message": "Photo deleted successfully"}

@app.get("/api/photos/search", response_model=List[schemas.PhotoResponse])
def search_photos(
    query: str,
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    photos = db.query(models.Photo).filter(
        models.Photo.user_id == current_user.id,
        (models.Photo.title.contains(query) | 
         models.Photo.description.contains(query) | 
         models.Photo.filter_name.contains(query))
    ).all()
    
    base_url = str(request.base_url)
    return [format_photo_response(p, base_url) for p in photos]
