from django.conf import settings
from rest_framework import serializers

from .models import Gym, Wall, HoldType, HoldInstance, WallSession


class HoldTypeSerializer(serializers.ModelSerializer):
    glb_url = serializers.SerializerMethodField()
    manufacturer_ref = serializers.CharField(read_only=True)  # property on model

    class Meta:
        model = HoldType
        fields = [
            'id',
            'cdn_ref',
            'manufacturer',
            'manufacturer_ref',
            'model',
            'size',
            'hold_usage_type',
            'available_colors',
            'color_of_scan',
            'glb_url',
        ]

    def get_glb_url(self, obj):
        if not obj.cdn_ref:
            return None
        return f"{settings.HOLDS_CDN_BASE}/{obj.cdn_ref}/hold.glb"


class HoldInstanceSerializer(serializers.ModelSerializer):
    hold_type = HoldTypeSerializer(read_only=True)

    class Meta:
        model = HoldInstance
        fields = ['id', 'name', 'usage_type', 'hold_type']


class WallSerializer(serializers.ModelSerializer):
    glb_url = serializers.SerializerMethodField()

    class Meta:
        model = Wall
        fields = ['id', 'name', 'glb_url']

    def get_glb_url(self, obj):
        if obj.cdn_ref:
            return f"{settings.WALLS_CDN_BASE}/{obj.cdn_ref}/wall.glb"
        if obj.glb_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.glb_file.url)
        return None


class WallSessionSerializer(serializers.ModelSerializer):
    related_wall = WallSerializer(source='wall', read_only=True)
    holds_collection_instances = HoldInstanceSerializer(
        source='holds_collection', many=True, read_only=True
    )
    related_holds_collection = serializers.SerializerMethodField()
    gym = serializers.SerializerMethodField()

    class Meta:
        model = WallSession
        fields = [
            'id',
            'session_name',
            'related_wall',
            'related_holds_collection',
            'holds_collection_instances',
            'gym',
        ]

    def get_related_holds_collection(self, obj):
        return obj.holds_collection.exists()

    def get_gym(self, obj):
        return {'id': obj.gym_id}
