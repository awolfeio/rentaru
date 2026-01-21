
export const MAINTENANCE_CATEGORIES_CONFIG = {
  plumbing: {
    label: "Plumbing",
    locations: ["Bathroom", "Kitchen", "Laundry Room", "Utility / Basement", "Exterior", "Other"],
    issues: [
      "Leaking pipe", "Clogged drain", "Running toilet", "No hot water", "Low water pressure", "Water backing up", "Broken fixture", "Other"
    ]
  },
  electrical: {
    label: "Electrical",
    locations: ["Living Area", "Bedroom", "Kitchen", "Bathroom", "Garage", "Exterior", "Other"],
    issues: [
      "Power outage", "Flickering lights", "Outlet not working", "Circuit breaker tripping", "Exposed wiring", "Appliance causing power issue", "Other"
    ]
  },
  hvac: {
    label: "HVAC",
    locations: ["Entire Unit", "Living Area", "Bedroom", "Utility / Closet", "Other"],
    issues: [
      "No heat", "No air conditioning", "Weak airflow", "Strange noises", "Thermostat issue", "Unit not turning on", "Other"
    ]
  },
  appliance: {
    label: "Appliance",
    locations: ["Kitchen", "Laundry", "Utility / Storage", "Other"],
    issues: [
      "Refrigerator", "Stove / Oven", "Dishwasher", "Microwave", "Washer", "Dryer", "Garbage disposal", "Other"
    ]
  },
  structural: {
    label: "Structural",
    locations: ["Ceiling", "Wall", "Floor", "Door / Window", "Balcony / Patio", "Exterior", "Other"],
    issues: [
      "Water damage", "Cracks", "Door won’t close", "Window leak", "Ceiling damage", "Flooring damage", "Other"
    ]
  },
  pest: {
    label: "Pest Control",
    locations: ["Kitchen", "Bathroom", "Living Area", "Bedroom", "Entire Unit", "Other"],
    issues: [
      "Rodents", "Ants", "Roaches", "Bed bugs", "Wasps / Bees", "Other insects", "Other"
    ]
  },
  safety: {
    label: "Safety",
    locations: ["Smoke Detector", "Carbon Monoxide Detector", "Door / Lock", "Window", "Lighting", "Other"],
    issues: [
      "Alarm not working", "Alarm chirping", "Door lock failure", "Broken window", "Exposed hazard", "Other"
    ]
  },
  other: {
    label: "Other",
    locations: ["Entire Unit", "Specific Room", "Exterior", "Other"],
    issues: [
      "General concern", "Noise issue", "Odor issue", "Unknown issue", "Other"
    ]
  }
};
