from django.contrib import admin
from .models import (
    StatusLookup, AppUser, Developer, Flight, Booking, 
    Ticket, InsurancePolicy, Payment, InsuranceClaim
)

# Register all models with the admin site
@admin.register(StatusLookup)
class StatusLookupAdmin(admin.ModelAdmin):
    list_display = ('statusId', 'statusType', 'code')
    list_filter = ('statusType',)
    search_fields = ('code', 'statusType')

@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'name', 'email', 'phone')
    search_fields = ('name', 'email')

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ('developerId', 'name', 'role', 'responsibility')
    search_fields = ('name', 'role')

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flightId', 'origin', 'destination', 'departureTime', 'arrivalTime', 'status')
    list_filter = ('status', 'origin', 'destination')
    search_fields = ('origin', 'destination')
    date_hierarchy = 'departureTime'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('bookingId', 'user', 'flight', 'bookingDate', 'status')
    list_filter = ('status', 'bookingDate')
    search_fields = ('user__name', 'user__email')
    date_hierarchy = 'bookingDate'

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticketId', 'booking', 'seatNumber', 'company', 'price', 'isPremium')
    list_filter = ('isPremium', 'company')
    search_fields = ('seatNumber', 'booking__user__name')

@admin.register(InsurancePolicy)
class InsurancePolicyAdmin(admin.ModelAdmin):
    list_display = ('policyId', 'booking', 'coverageAmount', 'premium', 'status')
    list_filter = ('status',)
    search_fields = ('booking__user__name',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('paymentId', 'booking', 'amount', 'paymentMethod', 'paymentDate', 'status')
    list_filter = ('status', 'paymentMethod', 'paymentDate')
    search_fields = ('booking__user__name',)
    date_hierarchy = 'paymentDate'

@admin.register(InsuranceClaim)
class InsuranceClaimAdmin(admin.ModelAdmin):
    list_display = ('claimId', 'policy', 'delayDuration', 'claimStatus', 'payoutAmount')
    list_filter = ('claimStatus',)
    search_fields = ('policy__booking__user__name',)
