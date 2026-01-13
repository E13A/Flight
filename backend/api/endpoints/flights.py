from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from core.models import Flight, StatusLookup
from asgiref.sync import sync_to_async

router = APIRouter()

class FlightSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    flightId: int
    origin: str
    destination: str
    departureTime: datetime
    arrivalTime: datetime
    status_code: str = None

    @staticmethod
    def resolve_status_code(obj):
        return obj.status.code

@router.get("/", response_model=List[FlightSchema])
def get_flights(origin: str = None, destination: str = None, date: str = None):
    queryset = Flight.objects.select_related('status').all().order_by('departureTime')
    
    if origin and origin.strip():
        queryset = queryset.filter(origin__icontains=origin)
    
    if destination and destination.strip():
        queryset = queryset.filter(destination__icontains=destination)
        
    if date:
        # Simple date filtering (assuming YYYY-MM-DD)
        # Filters for flights departing on that day
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
            queryset = queryset.filter(departureTime__date=target_date)
        except ValueError:
            pass # Ignore invalid dates

    flights = queryset[:50]
    results = []
    for f in flights:
        results.append(FlightSchema(
            flightId=f.flightId,
            origin=f.origin,
            destination=f.destination,
            departureTime=f.departureTime,
            arrivalTime=f.arrivalTime,
            status_code=f.status.code
        ))
    return results

@router.get("/{flight_id}", response_model=FlightSchema)
def get_flight(flight_id: int):
    try:
        f = Flight.objects.select_related('status').get(flightId=flight_id)
        return FlightSchema(
            flightId=f.flightId,
            origin=f.origin,
            destination=f.destination,
            departureTime=f.departureTime,
            arrivalTime=f.arrivalTime,
            status_code=f.status.code
        )
    except Flight.DoesNotExist:
        raise HTTPException(status_code=404, detail="Flight not found")
