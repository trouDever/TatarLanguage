import os
import random

from locust import HttpUser, between, task

EMAIL = os.environ.get("LOCUST_EMAIL", "student@tatarlang.local")
PASSWORD = os.environ.get("LOCUST_PASSWORD", "")


class Learner(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.course_ids = []
        response = self.client.post(
            "/api/v1/jwt/create/",
            json={"email": EMAIL, "password": PASSWORD},
            name="auth: jwt",
        )
        if response.ok:
            self.client.headers["Authorization"] = f"Bearer {response.json()['access']}"
        courses = self.client.get("/api/v1/course/", name="courses: list")
        if courses.ok:
            self.course_ids = [course["id"] for course in courses.json()]

    @task(4)
    def list_courses(self):
        self.client.get("/api/v1/course/", name="courses: list")

    @task(3)
    def open_course(self):
        if self.course_ids:
            course_id = random.choice(self.course_ids)
            self.client.get(f"/api/v1/course/{course_id}", name="courses: detail")

    @task(3)
    def list_events(self):
        self.client.get("/api/v1/events/", name="events: list")

    @task(2)
    def list_organizations(self):
        self.client.get("/api/v1/organization/", name="organizations: list")

    @task(1)
    def open_profile(self):
        self.client.get("/api/v1/user/profile/", name="profile")
