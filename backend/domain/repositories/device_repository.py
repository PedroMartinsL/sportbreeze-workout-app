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
