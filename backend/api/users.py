from fastapi import APIRouter,Depends,HTTPException
from auth_utils import get_current_user

router = APIRouter()

@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return {
        "id":current_user.id,
        "username":current_user.username,
        "email":current_user.email
    }