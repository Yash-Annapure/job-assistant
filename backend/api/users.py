from fastapi import APIRouter,Depends
from pydantic import BaseModel, ConfigDict
from auth_utils import get_current_user

router = APIRouter()

class UserOut(BaseModel):
    # from_attributes lets this read straight off a User ORM object, so the
    # route can return current_user without leaking hashed_password.
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str

@router.get("/me", response_model=UserOut)
async def get_me(current_user = Depends(get_current_user)):
    return current_user
