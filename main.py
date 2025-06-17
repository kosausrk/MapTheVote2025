# CivicScope NYC: Strategic Voting Landscape Tool for Mandani Campaign

import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Point

# --- Load Borough Geodata ---
# Use a shapefile or GeoJSON of NYC boroughs or precincts
boroughs = gpd.read_file("nyc_boroughs.geojson")

print(boroughs.columns)


# --- Mock Demographic and Turnout Data by Borough (Real data should be loaded here) ---
real_data = {
    'borough': ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'],
    'turnout_rate': [0.191, 0.275, 0.334, 0.25, 0.224],
    'unaffiliated_rate': [0.21, 0.19, 0.22, 0.20, 0.18],
    'under30_pct': [0.31, 0.29, 0.26, 0.28, 0.25],
    'college_edu_pct': [0.30, 0.45, 0.65, 0.40, 0.38],
    'avg_income_k': [47, 75, 100, 82, 96]
}


df = pd.DataFrame(real_data)

# --- Merge with GeoDataFrame ---


boroughs = boroughs.merge(df, left_on='BoroName', right_on='borough')



# --- Define a "Strategic Weight" Metric ---
boroughs['mandani_weight'] = (
    boroughs['unaffiliated_rate'] * 0.4 +
    boroughs['under30_pct'] * 0.3 +
    boroughs['college_edu_pct'] * 0.2 +
    boroughs['turnout_rate'] * 0.1
) * boroughs['avg_income_k']

# Normalize for visualization
boroughs['normalized_weight'] = (
    (boroughs['mandani_weight'] - boroughs['mandani_weight'].min()) /
    (boroughs['mandani_weight'].max() - boroughs['mandani_weight'].min())
)

# --- Plot Heightmap-style Strategic Weight by Borough ---
fig, ax = plt.subplots(figsize=(10, 8))
boroughs.plot(column='normalized_weight', cmap='viridis', linewidth=0.8, edgecolor='black', legend=True, ax=ax)
ax.set_title("Mandani Campaign Strategic Opportunity Map (CivicScope NYC)", fontsize=15)
ax.axis('off')
plt.tight_layout()
plt.show()

# --- Save for Web or Integration ---
# boroughs.to_file("mandani_strategy.geojson", driver="GeoJSON")


