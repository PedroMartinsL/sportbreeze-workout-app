from pydantic import BaseModel, ConfigDict

class DeviceSchema(BaseModel):
    device_token: str

class SetDeviceSchema(DeviceSchema):
    user_id: int

class DeviceResponse(DeviceSchema):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )