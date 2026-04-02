"""
Data migration: seed a demo gym, wall, and session.

Always safe to re-run — uses get_or_create so it won't duplicate records.
The demo wall points to the HF climbing-walls CDN (demo/demo.glb).
Navigate to /editor/1 (or whatever pk the Wall gets) to open it.
"""

from django.db import migrations


def create_demo_data(apps, schema_editor):
    Gym = apps.get_model('gym', 'Gym')
    Wall = apps.get_model('gym', 'Wall')
    WallSession = apps.get_model('gym', 'WallSession')

    gym, _ = Gym.objects.get_or_create(
        id=1,
        defaults={'name': 'Demo Gym'},
    )

    wall, _ = Wall.objects.get_or_create(
        id=1,
        defaults={
            'gym': gym,
            'name': 'Demo Wall',
            # Full path within the climbing-walls HF dataset repo
            'cdn_ref': 'demo/demo.glb',
        },
    )

    WallSession.objects.get_or_create(
        id=1,
        defaults={
            'wall': wall,
            'gym': gym,
            'session_name': 'Demo Session',
            'layout': '',
        },
    )


def remove_demo_data(apps, schema_editor):
    Gym = apps.get_model('gym', 'Gym')
    Wall = apps.get_model('gym', 'Wall')
    WallSession = apps.get_model('gym', 'WallSession')

    WallSession.objects.filter(id=1).delete()
    Wall.objects.filter(id=1).delete()
    Gym.objects.filter(id=1).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('gym', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_demo_data, remove_demo_data),
    ]
