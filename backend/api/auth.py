from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, field_validator
from auth_utils import hash_password,verify_password,create_access_token
from db.models import User
from db.database import get_db

router = APIRouter()

class UserRegistor(BaseModel):
    username : str
    email : EmailStr # auto checks for valid email format
    password: str

    @field_validator("username")
    def validate_username(cls,value):
        if len(value) < 3:
            raise ValueError("Username cannot be shorter than 3 characters")
        if len(value) > 32:
            raise ValueError("Username cannot be longer than 32 characters")
        return value
    
    @field_validator("password")
    def validate_password(cls,value):
        if len(value) < 8:
            raise ValueError("Password cannot be shorter than 8 characters")
        if len(value) > 72:
            raise ValueError("Password cannot be longer than 72 characters")
        return value

class UserLogin(BaseModel):
    email : EmailStr
    password : str


@router.post("/register")
def register_user(auth:UserRegistor, db = Depends(get_db)):
    
    existing_user = db.query(User).filter(User.email == auth.email).first()
    if existing_user:
        raise HTTPException(400,"Email already registered")
    
    # if len(auth.password) > 72:
    #     raise HTTPException(400, "Password cannot be longer than 72 characters") no need for this now as the pydantic field validator handles it
    
    db_user = User(username = auth.username, email = auth.email, hashed_password = hash_password(auth.password))
    db.add(db_user) 
    db.commit()
    db.refresh(db_user)
    
    token = create_access_token({"sub": db_user.email})
    return {"access token":token,"token_type": "bearer"}


@router.post("/login")
def user_login(auth:UserLogin, db = Depends(get_db)):
    #first step find the user in the database
    existing_email = db.query(User).filter(User.email == auth.email).first()
    if not existing_email:
        raise HTTPException(401,"Invalid Credentials")
    
    if not verify_password(auth.password, existing_email.hashed_password):
        raise HTTPException(401,"Invalid Credentials")
    
    
    token = create_access_token({"sub": existing_email.email})
    return {"access token":token,"token_type": "bearer"}

