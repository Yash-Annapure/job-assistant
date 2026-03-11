'''
hash_password()        → takes plain text, returns bcrypt hash
verify_password()      → compares plain text against stored hash  
create_access_token()  → builds a signed JWT with user_id + expiry
decode_access_token()  → validates and unpacks a JWT
'''
from passlib.context import CryptContext
from datetime import datetime,timedelta
from jose import JWTError, jwt
from fastapi import HTTPException
import os
from dotenv import load_dotenv
load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def hash_password(password:str) -> str:
    '''Hashing a plain text password using bcrypt algo'''
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str) -> bool:
    '''Verifying a plain password against its hash'''
    return pwd_context.verify(plain_password,hashed_password)

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


