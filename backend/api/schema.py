import strawberry
from typing import List, Optional
from core.models import Flight, AppUser
from asgiref.sync import sync_to_async

@strawberry.type
class FlightType:
    flightId: int
    origin: str
    destination: str
    departureTime: str
    arrivalTime: str

@strawberry.type
class UserType:
    user_id: int
    name: str
    email: str

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello World"

    @strawberry.field
    def flights(self) -> List[FlightType]:
        # Sync to async wrapper if needed, or rely on sync resolver
        flights = Flight.objects.all()[:10]
        return [
            FlightType(
                flightId=f.flightId,
                origin=f.origin,
                destination=f.destination,
                departureTime=str(f.departureTime),
                arrivalTime=str(f.arrivalTime)
            ) for f in flights
        ]

schema = strawberry.Schema(query=Query)
