import os
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone

from events.models import Event
from organizations.models import Course, Organization

User = get_user_model()

email = os.environ["DEMO_EMAIL"]
password = os.environ["DEMO_PASSWORD"]
domain = email.split("@", 1)[1]


def ensure_user(address, role):
    user, created = User.objects.get_or_create(email=address, defaults={"role": role})
    if created:
        user.set_password(password)
        user.save()
    return user


student = ensure_user(email, "user")
teacher = ensure_user(f"school@{domain}", "organization")

school, _ = Organization.objects.get_or_create(
    name="Mektep",
    defaults={"owner": teacher, "description": "Tatar language school"},
)

today = date.today()
for number in range(1, 25):
    Course.objects.get_or_create(
        organization=school,
        name=f"Tatar {number}",
        defaults={
            "level": number % 6 + 1,
            "start_date": today + timedelta(days=number),
            "end_date": today + timedelta(days=number + 90),
        },
    )

for number in range(1, 41):
    Event.objects.get_or_create(
        external_id=f"seed-{number}",
        defaults={
            "title": f"Event {number}",
            "event_type": "concert" if number % 2 else "theatre",
            "source_url": "https://example.org/events",
            "date": timezone.now() + timedelta(days=number),
            "venue": "Kazan",
        },
    )

print("bootstrap done:", User.objects.count(), Course.objects.count(), Event.objects.count())
