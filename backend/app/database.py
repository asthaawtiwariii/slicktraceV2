import duckdb
from pathlib import Path
from .config import settings

def get_duckdb_connection():
    settings.DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = duckdb.connect(str(settings.DATABASE_PATH))
    return conn

def init_db():
    conn = get_duckdb_connection()

    # 1. Create Marine Cadastre AIS Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS ais_records (
            MMSI VARCHAR,
            BaseDateTime TIMESTAMP,
            LAT DOUBLE,
            LON DOUBLE,
            SOG DOUBLE,
            COG DOUBLE,
            Heading DOUBLE,
            VesselName VARCHAR,
            IMO VARCHAR,
            CallSign VARCHAR,
            VesselType VARCHAR,
            Status VARCHAR,
            Length DOUBLE,
            Width DOUBLE,
            Draft DOUBLE,
            Cargo VARCHAR
        );
    """)

    # 2. Create Incidents Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id VARCHAR PRIMARY KEY,
            title VARCHAR,
            location_name VARCHAR,
            status VARCHAR,
            detection_date VARCHAR,
            satellite_sensor VARCHAR,
            orbit_pass VARCHAR,
            resolution VARCHAR,
            centroid_lat DOUBLE,
            centroid_lon DOUBLE,
            area_km2 DOUBLE,
            perimeter_km DOUBLE,
            estimated_volume_m3 DOUBLE,
            estimated_age_hours DOUBLE,
            confidence DOUBLE,
            thickness_microns DOUBLE,
            origin_lat DOUBLE,
            origin_lon DOUBLE,
            origin_timestamp VARCHAR
        );
    """)

    # 3. Create Forensic Audit Reports Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS forensic_reports (
            report_id VARCHAR PRIMARY KEY,
            incident_id VARCHAR,
            generated_at VARCHAR,
            investigating_officer VARCHAR,
            primary_culprit_mmsi VARCHAR,
            culprit_name VARCHAR,
            attribution_score DOUBLE,
            min_cpa_meters DOUBLE,
            speed_anomaly_drop_knots DOUBLE,
            ais_gap_minutes DOUBLE,
            sha256_hash VARCHAR
        );
    """)

    # Check if ais_records table is empty; seed realistic Marine Cadastre dataset if so
    count = conn.execute("SELECT COUNT(*) FROM ais_records").fetchone()[0]
    if count == 0:
        seed_sample_cadastre_data(conn)

    # Check if incidents is empty; seed initial incidents
    inc_count = conn.execute("SELECT COUNT(*) FROM incidents").fetchone()[0]
    if inc_count == 0:
        seed_sample_incidents(conn)

    conn.close()

def seed_sample_cadastre_data(conn):
    """Seed real-world representative Marine Cadastre records for Gulf of Mexico & Malacca"""
    records = [
        # Vessel PA2017 (MT NORTH STAR) - Culprit Tanker
        ("235109785", "2024-11-24 08:00:00", 28.58, -90.35, 14.6, 128, 128, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Underway using engine", 274, 48, 14.8, "Crude Oil"),
        ("235109785", "2024-11-24 10:30:00", 28.52, -90.25, 14.2, 130, 130, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Underway using engine", 274, 48, 14.8, "Crude Oil"),
        ("235109785", "2024-11-24 12:15:00", 28.472, -90.165, 4.8, 131, 131, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Restricted Maneuverability", 274, 48, 14.8, "Crude Oil"),
        ("235109785", "2024-11-24 12:30:00", 28.468, -90.158, 2.3, 132, 132, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Restricted Maneuverability", 274, 48, 14.8, "Crude Oil"),
        ("235109785", "2024-11-24 14:15:00", 28.43, -90.09, 3.4, 135, 135, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Underway using engine", 274, 48, 14.8, "Crude Oil"),
        ("235109785", "2024-11-24 17:00:00", 28.36, -89.96, 13.8, 134, 134, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Underway using engine", 274, 48, 14.8, "Crude Oil"),
        ("235109785", "2024-11-24 21:00:00", 28.24, -89.78, 14.4, 135, 135, "Vessel PA2017", "9412038", "V2AB8", "Crude Oil Tanker", "Underway using engine", 274, 48, 14.8, "Crude Oil"),
        
        # Vessel DA80061 (Chemical Tanker)
        ("211832000", "2024-11-24 09:00:00", 28.62, -90.28, 13.2, 140, 140, "Vessel DA80061", "9238471", "DLBX", "Chemical Tanker", "Underway", 182, 32, 11.2, "Chemicals"),
        ("211832000", "2024-11-24 13:18:00", 28.51, -90.12, 10.6, 142, 142, "Vessel DA80061", "9238471", "DLBX", "Chemical Tanker", "Underway", 182, 32, 11.2, "Chemicals"),
        ("211832000", "2024-11-24 17:30:00", 28.39, -89.95, 12.8, 141, 141, "Vessel DA80061", "9238471", "DLBX", "Chemical Tanker", "Underway", 182, 32, 11.2, "Chemicals"),

        # Vessel DA80688 (Bulk Carrier)
        ("352001920", "2024-11-24 10:00:00", 28.68, -90.20, 14.4, 155, 155, "Vessel DA80688", "9518290", "3E219", "Bulk Carrier", "Underway", 225, 32, 12.5, "Dry Bulk"),
        ("352001920", "2024-11-24 14:05:00", 28.48, -90.04, 8.5, 155, 155, "Vessel DA80688", "9518290", "3E219", "Bulk Carrier", "Underway", 225, 32, 12.5, "Dry Bulk"),
        ("352001920", "2024-11-24 18:10:00", 28.28, -89.88, 13.3, 154, 154, "Vessel DA80688", "9518290", "3E219", "Bulk Carrier", "Underway", 225, 32, 12.5, "Dry Bulk"),

        # Vessel FA2033 (Container)
        ("477123900", "2024-11-24 11:00:00", 28.75, -89.70, 16.2, 200, 200, "Vessel FA2033", "9398822", "VRGT6", "Container Ship", "Underway", 294, 38, 13.0, "Containers"),
        ("477123900", "2024-11-24 15:30:00", 28.30, -89.50, 14.0, 200, 200, "Vessel FA2033", "9398822", "VRGT6", "Container Ship", "Underway", 294, 38, 13.0, "Containers"),

        # Vessel DA89122 (Cargo)
        ("316024000", "2024-11-24 12:00:00", 28.60, -89.40, 15.0, 180, 180, "Vessel DA89122", "9283711", "CFD21", "Cargo Vessel", "Underway", 190, 28, 9.5, "General Cargo"),
        ("316024000", "2024-11-24 18:00:00", 28.10, -89.40, 14.8, 180, 180, "Vessel DA89122", "9283711", "CFD21", "Cargo Vessel", "Underway", 190, 28, 9.5, "General Cargo"),

        # Vessel DA89607 (Container)
        ("228381000", "2024-11-24 10:00:00", 28.80, -89.30, 17.5, 160, 160, "Vessel DA89607", "9182741", "FNJK", "Container Ship", "Underway", 260, 32, 12.0, "Containers"),
        ("228381000", "2024-11-24 16:00:00", 28.20, -89.10, 17.2, 160, 160, "Vessel DA89607", "9182741", "FNJK", "Container Ship", "Underway", 260, 32, 12.0, "Containers"),

        # Vessel FA2023 (Products Tanker)
        ("636015000", "2024-11-24 09:30:00", 28.65, -90.25, 14.0, 145, 145, "Vessel FA2023", "9372819", "A8LK2", "Oil Products Tanker", "Underway", 210, 32, 11.5, "Refined Fuel"),
        ("636015000", "2024-11-24 13:30:00", 28.45, -90.05, 9.0, 145, 145, "Vessel FA2023", "9372819", "A8LK2", "Oil Products Tanker", "Underway", 210, 32, 11.5, "Refined Fuel"),
        ("636015000", "2024-11-24 17:30:00", 28.25, -89.85, 13.5, 145, 145, "Vessel FA2023", "9372819", "A8LK2", "Oil Products Tanker", "Underway", 210, 32, 11.5, "Refined Fuel")
    ]

    conn.executemany("""
        INSERT INTO ais_records VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, records)

def seed_sample_incidents(conn):
    incidents_data = [
        (
            'INC-GOM-2024-08',
            'SPILL-DELTA-08 (Mississippi Canyon Block 42)',
            'Gulf of Mexico — EEZ Sector 4',
            'Critical Alert',
            '2024-11-25 22:30 UTC',
            'Sentinel-1B (SAR C-Band GRD)',
            'Ascending Pass #142 (IW Mode)',
            '10m Spatial Resolution (VV+VH)',
            28.38, -89.92,
            48.3, 38.6,
            1250.0, 34.0,
            94.2, 25.8,
            28.465, -90.155,
            '2024-11-24 12:30 UTC'
        ),
        (
            'INC-REAL-WAKASHIO',
            'MV WAKASHIO Coral Reef Grounding (Pointe d''Esny)',
            'Mauritius — Blue Bay Marine Reserve',
            'Enforcement Dispatched',
            '2020-08-10 14:15 UTC',
            'Sentinel-1B SAR + Sentinel-2B MSI',
            'Ascending Pass #078 (IW Polarimetric)',
            '10m Spatial Resolution (VV/VH Calibrated)',
            -20.443, 57.747,
            32.4, 28.5,
            1000.0, 18.0,
            98.5, 30.5,
            -20.440, 57.745,
            '2020-08-06 15:30 UTC'
        ),
        (
            'INC-REAL-TOBAGO',
            'Mystery Barge GULFSTREAM 150km Transboundary Spill',
            'Tobago & Caribbean Sea — Cove Eco-Industrial Sector',
            'Under Investigation',
            '2024-02-07 22:15 UTC',
            'Sentinel-1A (SAR C-Band GRD)',
            'Descending Pass #112',
            '10m Spatial Resolution',
            11.148, -60.778,
            85.6, 154.2,
            5500.0, 42.0,
            96.8, 38.0,
            10.850, -60.950,
            '2024-02-05 06:00 UTC'
        ),
        (
            'INC-REAL-VENTANILLA',
            'MARE DORICUM / La Pampilla Terminal Crude Discharge',
            'Peru — Callao / Ventanilla Marine Reserve',
            'Dossier Prepared',
            '2022-01-16 11:40 UTC',
            'Sentinel-1 SAR + Sentinel-2 L2A',
            'Ascending Pass #034',
            '10m Spatial Resolution (VV+VH)',
            -11.928, -77.162,
            58.2, 49.0,
            1890.0, 22.0,
            97.4, 32.5,
            -11.932, -77.168,
            '2022-01-15 22:30 UTC'
        ),
        (
            'INC-REAL-RUBYMAR',
            'MV RUBYMAR Sinking & 29-Mile Red Sea Oil Slick',
            'Red Sea — Bab-el-Mandeb Strait & Hanish Islands',
            'Critical Alert',
            '2024-02-28 07:30 UTC',
            'Sentinel-2 MSI + Sentinel-1 SAR',
            'Descending Pass #056',
            '10m Spatial Resolution (NDWI + SAR)',
            13.720, 42.750,
            64.5, 78.4,
            2400.0, 28.0,
            95.1, 28.0,
            13.650, 42.820,
            '2024-02-19 18:00 UTC'
        ),
        (
            'INC-MALACCA-2024-03',
            'SPILL-STRAIT-03 (One Fathom Bank West TSS)',
            'Strait of Malacca — TSS Traffic Separation Scheme',
            'Under Investigation',
            '2024-10-14 06:15 UTC',
            'Sentinel-1A (SAR C-Band GRD)',
            'Descending Pass #089',
            '10m Spatial Resolution',
            2.880, 101.020,
            26.4, 24.2,
            680.0, 19.0,
            91.0, 18.4,
            2.980, 100.860,
            '2024-10-13 11:15 UTC'
        )
    ]

    conn.executemany("""
        INSERT INTO incidents VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, incidents_data)

