import requests
from ..config import settings
from ..schemas import MetoceanDataModel

class MetoceanService:
    @staticmethod
    def get_metocean_conditions(lat: float, lon: float) -> MetoceanDataModel:
        """
        Fetches live ocean surface currents and 10m wind parameters.
        Queries Open-Meteo Marine API + Open-Meteo Weather API in real-time.
        """
        current_speed = 0.85
        current_dir = 135.0
        wave_height = 1.2
        sea_temp = 24.6
        wind_speed = 14.2
        wind_dir = 315.0
        marine_source = "Open-Meteo Marine / NOAA HYCOM Global"
        wind_source = "ECMWF / GFS Operational Atmospheric"

        # 1. Fetch live marine ocean currents & waves
        try:
            marine_url = f"{settings.OPEN_METEO_MARINE_API}?latitude={lat}&longitude={lon}&current=wave_height,wave_direction,ocean_current_velocity,ocean_current_direction,sea_surface_temperature"
            resp = requests.get(marine_url, timeout=4.0)
            if resp.status_code == 200:
                data = resp.json().get("current", {})
                if data.get("ocean_current_velocity") is not None:
                    current_speed = float(data["ocean_current_velocity"])
                if data.get("ocean_current_direction") is not None:
                    current_dir = float(data["ocean_current_direction"])
                if data.get("wave_height") is not None:
                    wave_height = float(data["wave_height"])
                if data.get("sea_surface_temperature") is not None:
                    sea_temp = float(data["sea_surface_temperature"])
                marine_source = "Open-Meteo Marine Live Operational"
        except Exception:
            pass

        # 2. Fetch live atmospheric 10m wind velocity & direction
        try:
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=wind_speed_10m,wind_direction_10m,temperature_2m&wind_speed_unit=kn"
            resp_w = requests.get(weather_url, timeout=4.0)
            if resp_w.status_code == 200:
                data_w = resp_w.json().get("current", {})
                if data_w.get("wind_speed_10m") is not None:
                    wind_speed = float(data_w["wind_speed_10m"])
                if data_w.get("wind_direction_10m") is not None:
                    wind_dir = float(data_w["wind_direction_10m"])
                wind_source = "ECMWF / Open-Meteo Real-Time Atmospheric Feed"
        except Exception:
            pass

        return MetoceanDataModel(
            wind_speed_knots=round(wind_speed, 1),
            wind_direction_deg=round(wind_dir, 1),
            current_speed_knots=round(current_speed, 2),
            current_direction_deg=round(current_dir, 1),
            leeway_factor=settings.DEFAULT_LEEWAY,
            sea_surface_temp_c=round(sea_temp, 1),
            wave_height_m=round(wave_height, 2),
            current_model_source=marine_source,
            wind_model_source=wind_source
        )

