"""
Seed database with demo data for FlightGuard DApp
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Flight, StatusLookup
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_data():
    print("🌱 Seeding database...")
    
    # 1. Create statuses
    print("[1/3] Creating status lookups...")
    statuses = [
        # Flight statuses
        ('Scheduled', 'flight'),
        ('Delayed', 'flight'),
        ('Cancelled', 'flight'),
        ('Completed', 'flight'),
        # Booking statuses
        ('Confirmed', 'booking'),
        ('Active', 'booking'),
        ('Cancelled', 'booking'),
        # Payment statuses
        ('Completed', 'payment'),
        ('Pending', 'payment'),
        ('Failed', 'payment'),
        # Policy statuses
        ('Active', 'policy'),
        ('Claimed', 'policy'),
        ('Expired', 'policy'),
    ]
    
    for code, status_type in statuses:
        StatusLookup.objects.get_or_create(
            code=code,
            defaults={'statusType': status_type}
        )
    
    print(f"✓ Created {len(statuses)} status types")
    
    # 2. Create admin user
    print("[2/3] Creating admin user...")
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@flightguard.com',
            password='admin123'
        )
        print("✓ Admin user created (username: admin, password: admin123)")
    else:
        print("✓ Admin user already exists")
    
    # 3. Create demo flights
    print("[3/3] Creating demo flights...")
    
    scheduled_status = StatusLookup.objects.get(code='Scheduled', statusType='flight')
    
    # Demo flights data
    flights_data = [
        ("JFK", "LAX", "New York", "Los Angeles", 5.5, 350),
        ("LAX", "JFK", "Los Angeles", "New York", 5.5, 380),
        ("ORD", "MIA", "Chicago", "Miami", 3.0, 220),
        ("MIA", "ORD", "Miami", "Chicago", 3.0, 240),
        ("SFO", "SEA", "San Francisco", "Seattle", 2.0, 180),
        ("SEA", "SFO", "Seattle", "San Francisco", 2.0, 190),
        ("BOS", "DEN", "Boston", "Denver", 4.0, 300),
        ("DEN", "BOS", "Denver", "Boston", 4.0, 310),
        ("ATL", "DFW", "Atlanta", "Dallas", 2.5, 200),
        ("DFW", "ATL", "Dallas", "Atlanta", 2.5, 210),
    ]
    
    created_count = 0
    now = datetime.now()
    
    for i, (origin, dest, origin_city, dest_city, duration, price) in enumerate(flights_data):
        # Create flights for next 7 days
        for day_offset in range(7):
            departure_time = now + timedelta(days=day_offset, hours=8 + (i * 2) % 12)
            arrival_time = departure_time + timedelta(hours=duration)
            
            flight, created = Flight.objects.get_or_create(
                origin=origin,
                destination=dest,
                departureTime=departure_time,
                defaults={
                    'arrivalTime': arrival_time,
                    'status': scheduled_status,
                }
            )
            
            if created:
                created_count += 1
    
    print(f"✓ Created {created_count} demo flights")
    
    print("\n✅ Database seeded successfully!")
    print(f"\n📊 Summary:")
    print(f"   - Flights: {Flight.objects.count()}")
    print(f"   - Statuses: {StatusLookup.objects.count()}")
    print(f"   - Users: {User.objects.count()}")
    print(f"\n🔐 Admin Login:")
    print(f"   URL: http://localhost:8000/admin")
    print(f"   Username: admin")
    print(f"   Password: admin123")

if __name__ == "__main__":
    seed_data()
