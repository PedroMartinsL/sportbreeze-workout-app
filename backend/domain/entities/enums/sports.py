import enum

class SportEnum(str, enum.Enum):
    RUNNING = "RUNNING"
    GYM = "GYM"
    HIKING = "HIKING"
    CYCLING = "CYCLING"
    SWIMMING = "SWIMMING"