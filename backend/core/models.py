from django.db import models

class StatusLookup(models.Model):
    statusId = models.AutoField(primary_key=True, db_column='statusid')
    statusType = models.CharField(max_length=20, db_column='statustype')
    code = models.CharField(max_length=30)
    
    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'statuslookup'
        unique_together = (('statusType', 'code'),)

    def __str__(self):
        return f"{self.statusType}: {self.code}"

class AppUser(models.Model):
    user_id = models.AutoField(primary_key=True, db_column='user_id')
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = '"User"' # Explicitly quoted in schema

    def __str__(self):
        return self.name

class Developer(models.Model):
    developerId = models.AutoField(primary_key=True, db_column='developerid')
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50, null=True, blank=True)
    responsibility = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'developer'

class Flight(models.Model):
    flightId = models.AutoField(primary_key=True, db_column='flightid')
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departureTime = models.DateTimeField(db_column='departuretime')
    arrivalTime = models.DateTimeField(db_column='arrivaltime')
    status = models.ForeignKey(StatusLookup, on_delete=models.CASCADE, db_column='statusid')

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'flight'

    def __str__(self):
        return f"{self.origin} -> {self.destination} ({self.departureTime})"

class Booking(models.Model):
    bookingId = models.AutoField(primary_key=True, db_column='bookingid')
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, db_column='user_id')  # CASCADE: Delete bookings when user deleted
    flight = models.ForeignKey(Flight, on_delete=models.DO_NOTHING, db_column='flightid')  # Keep DO_NOTHING for flights
    bookingDate = models.DateTimeField(db_column='bookingdate')
    status = models.ForeignKey(StatusLookup, on_delete=models.CASCADE, db_column='statusid')

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'booking'

class Ticket(models.Model):
    ticketId = models.AutoField(primary_key=True, db_column='ticketid')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, db_column='bookingid')
    seatNumber = models.CharField(max_length=20, db_column='seatnumber')
    company = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    issueDate = models.DateTimeField(db_column='issuedate')
    isPremium = models.BooleanField(default=False, db_column='ispremium')

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'ticket'

class InsurancePolicy(models.Model):
    policyId = models.AutoField(primary_key=True, db_column='policyid')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, db_column='bookingid')
    coverageAmount = models.DecimalField(max_digits=10, decimal_places=2, db_column='coverageamount')
    premium = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.ForeignKey(StatusLookup, on_delete=models.CASCADE, db_column='statusid')
    blockchainPolicyId = models.IntegerField(null=True, blank=True, db_column='blockchainpolicyid')  # NEW: On-chain policy ID
    blockchainTxHash = models.CharField(max_length=66, null=True, blank=True, db_column='blockchaintxhash')  # NEW: Transaction hash

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'insurancepolicy'

class Payment(models.Model):
    paymentId = models.AutoField(primary_key=True, db_column='paymentid')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, db_column='bookingid')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paymentMethod = models.CharField(max_length=50, db_column='paymentmethod')
    paymentDate = models.DateTimeField(db_column='paymentdate')
    status = models.ForeignKey(StatusLookup, on_delete=models.CASCADE, db_column='statusid')

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'payment'

class InsuranceClaim(models.Model):
    claimId = models.AutoField(primary_key=True, db_column='claimid')
    policy = models.ForeignKey(InsurancePolicy, on_delete=models.DO_NOTHING, db_column='policyid')
    delayDuration = models.FloatField(db_column='delayduration')
    claimStatus = models.CharField(max_length=50, db_column='claimstatus')
    payoutAmount = models.DecimalField(max_digits=10, decimal_places=2, db_column='payoutamount')

    class Meta:
        managed = True  # Changed for local SQLite development
        db_table = 'insuranceclaim'
