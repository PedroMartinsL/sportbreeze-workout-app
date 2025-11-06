from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timedelta
import httpx
import asyncio

from dependencies import get_session
from domain.entities.device import Device
from domain.entities.workout import Workout


async def send_notification(device_token: str, title: str, body: str):
    async with httpx.AsyncClient() as client:
        await client.post("https://exp.host/--/api/v2/push/send", json={
            "to": device_token,
            "title": title,
            "body": body
        })


async def check_workouts_to_notify():

    notify_before = timedelta(minutes=10)
    
    # cria uma sessão
    for session in get_session():
        now = datetime.now()
        
        workouts = session.query(Workout).filter(Workout.hour >= now).all()
        for workout in workouts:
            if workout.notify:
                continue
            time_diff = Workout.hour - now
            if timedelta(0) <= time_diff <= notify_before:
                device = session.query(Device).filter(Device.user_id == workout.user_id).first()
                if device:
                    asyncio.create_task(send_notification(
                        device.device_token,
                        title="Your workout is up to start!",
                        body=f"Get ready for: {workout.name} - {workout.sport}"
                    ))
                    workout.notify = True
                    session.commit()

async def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_workouts_to_notify, "interval", minutes=10)
    scheduler.start()