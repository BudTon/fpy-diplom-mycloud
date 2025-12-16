import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


def user_directory_path(instance, filename):
    return f"user_{instance.user.username}_{instance.user.id}/{filename}"

class UserCloud(AbstractUser):

    def count_files(self):
        return self.file_set.count()

    def total_file_size(self):
        return sum(
            file.size for file in self.file_set.all()
        )

    def __str__(self):
        return self.username

class File(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserCloud, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=200, unique=False, default="Unnamed")
    file = models.FileField(
        upload_to=user_directory_path, default="path/to/default/file"
    )
    short_hash = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    lastDownloadDate = models.DateTimeField(null=True, blank=True)
    size = models.PositiveIntegerField(default=0)
    comment = models.CharField(max_length=250, null=True, blank=True)
    links = models.JSONField(default=dict, blank=True, null=True)
    type = models.CharField(max_length=50, default="unknown")

    def __str__(self):
        return f"{self.file.name} ({self.user.username})"
