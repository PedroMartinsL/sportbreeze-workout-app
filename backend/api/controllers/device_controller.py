

from fastapi import APIRouter, Depends

from application.use_cases.device.set_device import SetDeviceUseCase
from backend.dependencies import verify_token
from backend.domain.entities.user import User
from schemas.device_schema import DeviceSchema, SetDeviceSchema

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/device")
async def set_device_id(device_schema: DeviceSchema, set_device_use_case: SetDeviceUseCase = Depends(), user: User = Depends(verify_token)):
    device_request = SetDeviceSchema(device_schema.device_id, user)
    return set_device_use_case.execute(device_request)
        