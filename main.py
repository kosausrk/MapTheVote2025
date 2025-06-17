# CivicScope NYC: Strategic Voting Landscape Tool for Civic Engagement

import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Point

# --- Load Borough Geodata ---
# NYC borough boundaries GeoJSON file must be in the same directory
boroughs = gpd.read_file("nyc_boroughs.geojson")

print("Loaded columns from GeoJSON:", boroughs.columns)

# --- Real Demographic and Turnout Data by Borough (2021–2024 Estimations) ---
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
# This formula estimates influence based on demographics, turnout, and income
boroughs['mandani_weight'] = (
    boroughs['unaffiliated_rate'] * 0.4 +
    boroughs['under30_pct'] * 0.3 +
    boroughs['college_edu_pct'] * 0.2 +
    boroughs['turnout_rate'] * 0.1
) * boroughs['avg_income_k']

# Normalize for visualization (0–1 scale)
boroughs['normalized_weight'] = (
    (boroughs['mandani_weight'] - boroughs['mandani_weight'].min()) /
    (boroughs['mandani_weight'].max() - boroughs['mandani_weight'].min())
)

# --- Plot Heightmap-style Strategic Weight by Borough ---
fig, ax = plt.subplots(figsize=(12, 9))
boroughs.plot(
    column='normalized_weight',
    cmap='RdYlGn',  # Red (low strategic value) → Green (high value)
    linewidth=1,
    edgecolor='black',
    legend=True,
    ax=ax
)

# --- Labeling and Interpretation ---
ax.set_title("2025 NYC Voter Influence Landscape\n(Strategic Opportunity Index by Borough)", fontsize=16, fontweight='bold')
ax.annotate("Higher = Younger, Educated, Unaffiliated, and Undermobilized Voters",
            xy=(0.5, 0.06), xycoords='figure fraction', ha='center', fontsize=10, color='gray')
ax.annotate("Use this map to identify priority regions for civic engagement or outreach",
            xy=(0.5, 0.03), xycoords='figure fraction', ha='center', fontsize=10, color='gray')
ax.axis('off')
plt.tight_layout()
plt.show()

# --- Save for Web or Integration ---
# boroughs.to_file("mandani_strategy.geojson", driver="GeoJSON")
