'''
hash_password()        → takes plain text, returns bcrypt hash
verify_password()      → compares plain text against stored hash  
create_access_token()  → builds a signed JWT with user_id + expiry
decode_access_token()  → validates and unpacks a JWT
'''
from db.database import get_db
from db.models import User
import bcrypt
from datetime import datetime,timedelta
from jose import JWTError, jwt
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
import os
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def hash_password(password:str) -> str:
    '''Hashing a plain text password using bcrypt algo'''
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password:str,hashed_password:str) -> bool:
    '''Verifying a plain password against its hash'''
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def create_access_token(sub:dict, expires_delta: timedelta = None):
    to_encode = sub.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token:str):
    try:
        #to decode the previously encoded jwt token
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])

        #extract the username from our payload (data)
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        
        return username # for furthur checking and to fetch users from Postgres
        
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/auth/login")
def get_current_user(token: str = Depends(oauth2_schema), db = Depends(get_db)):
    get_mail = decode_access_token(token) #already returns an email string
    existing_mail = db.query(User).filter(User.email == get_mail).first()
    if not existing_mail:
        raise HTTPException(401, "Invalid Credentials")
    return existing_mail




