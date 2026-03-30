from django.db import models


class Gym(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Wall(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='walls')
    name = models.CharField(max_length=200)
    cdn_ref = models.CharField(max_length=500, blank=True)  # HF dataset folder, e.g. "0000000001"
    glb_file = models.FileField(upload_to='walls/', blank=True)  # fallback for local uploads

    def __str__(self):
        return f"{self.gym.name} — {self.name}"


class HoldType(models.Model):
    USAGE_CHOICES = [('hold', 'Hold'), ('volume', 'Volume'), ('unknown', 'Unknown')]

    # HF dataset folder ID, e.g. "0000000001" — CDN URL is built from this at runtime
    cdn_ref = models.CharField(max_length=20, unique=True)

    manufacturer = models.CharField(max_length=200, default='unknown')
    model = models.CharField(max_length=200, default='unknown')
    size = models.CharField(max_length=100, default='unknown')
    hold_usage_type = models.CharField(max_length=20, choices=USAGE_CHOICES, default='unknown')
    available_colors = models.JSONField(default=list)   # e.g. ["#FF3200", "#2962A7"]
    color_of_scan = models.CharField(max_length=7, blank=True)  # e.g. "#FF3200"

    # Keep manufacturer_ref for backwards compatibility with existing frontend code
    @property
    def manufacturer_ref(self):
        return f"{self.manufacturer} — {self.model}" if self.model != 'unknown' else self.manufacturer

    def __str__(self):
        return f"{self.cdn_ref} ({self.manufacturer} / {self.model})"


class HoldInstance(models.Model):
    USAGE_CHOICES = [('hold', 'Hold'), ('volume', 'Volume')]

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='hold_instances')
    hold_type = models.ForeignKey(HoldType, on_delete=models.CASCADE, related_name='instances')
    name = models.CharField(max_length=200)
    usage_type = models.CharField(max_length=20, choices=USAGE_CHOICES, default='hold')

    def __str__(self):
        return f"{self.gym.name} — {self.name}"


class WallSession(models.Model):
    wall = models.ForeignKey(Wall, on_delete=models.CASCADE, related_name='sessions')
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='sessions')
    session_name = models.CharField(max_length=200)
    layout = models.TextField(blank=True)
    holds_collection = models.ManyToManyField(HoldInstance, blank=True, related_name='sessions')

    def __str__(self):
        return f"{self.wall.name} — {self.session_name}"
