from fastapi import Depends
from requests import Session

from domain.entities.device import Device
from dependencies import get_session

class DeviceRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db

    def create(self, device_data: dict) -> Device:
        device = Device(**device_data)
        self.db.add(device)
        self.db.commit()
        self.db.refresh(device)
        return device

    def find_by_user(self, user_id: int):
        return self.db.query(Device).filter(Device.user_id == user_id).first()
    
    def update(self, device: Device, update_data: dict):
        if not device:
            return None
        
        for field, value in update_data.items():
            if hasattr(Device, field):
                setattr(device, field, value)

        self.db.commit()
        self.db.refresh(device)
        return device
