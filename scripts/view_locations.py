import json
import os

LOCATION_PATH = "../data/locations.json"

if not os.path.exists(LOCATION_PATH):
    print("❌ No location file found.")
    exit()

with open(LOCATION_PATH) as f:
    try:
        data = json.load(f)
    except json.JSONDecodeError:
        print("❌ Invalid JSON format in locations.json")
        exit()

if not isinstance(data, list):
    print("❌ locations.json is not a list")
    exit()

for loc in data:
    lat = loc.get("latitude")
    lon = loc.get("longitude")
    time = loc.get("time")
    if lat and lon:
        print(f"{time or 'Unknown time'} ➤ https://www.google.com/maps?q={lat},{lon}")
