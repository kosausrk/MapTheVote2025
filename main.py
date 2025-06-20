# CivicScope NYC: Strategic Voting Landscape Tool for Civic Engagement

#Done 
# Add NYC strategic voting visualizations (Matplotlib, Folium, Plotly)

# - Loaded `nyc_data.geojson` and merged with demographic + turnout data (2021–2024)
# - Computed and normalized custom "Strategic Opportunity Index" for boroughs
# - Generated static heightmap plot using Matplotlib
# - Built interactive Leaflet map with Folium and saved as HTML
# - Created animated turnout choropleth (2021–2024) using Plotly
# - Fixed file path bugs, added GeoJsonTooltip/Popup, cleaned up imports


import pandas as pd
import geopandas as gpd
import folium
from folium.features import GeoJson, GeoJsonTooltip, GeoJsonPopup
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Point
import plotly.express as px

# --- Load Borough Geodata ---
boroughs = gpd.read_file("nyc_data.geojson")
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

# --- Merge and Compute Strategic Weight ---
boroughs = boroughs.merge(df, left_on='BoroName', right_on='borough')
boroughs['mandani_weight'] = (
    boroughs['unaffiliated_rate'] * 0.4 +
    boroughs['under30_pct'] * 0.3 +
    boroughs['college_edu_pct'] * 0.2 +
    boroughs['turnout_rate'] * 0.1
) * boroughs['avg_income_k']
boroughs['normalized_weight'] = (
    (boroughs['mandani_weight'] - boroughs['mandani_weight'].min()) /
    (boroughs['mandani_weight'].max() - boroughs['mandani_weight'].min())
)

# --- Static Matplotlib Plot ---
fig, ax = plt.subplots(figsize=(12, 9))
boroughs.plot(
    column='normalized_weight',
    cmap='RdYlGn',
    linewidth=1,
    edgecolor='black',
    legend=True,
    ax=ax
)
ax.set_title("2025 NYC Voter Influence Landscape\n(Strategic Opportunity Index by Borough)",
             fontsize=16, fontweight='bold')
ax.annotate("Higher = Younger, Educated, Unaffiliated, and Undermobilized Voters",
            xy=(0.5, 0.06), xycoords='figure fraction', ha='center', fontsize=10, color='gray')
ax.annotate("Use this map to identify priority regions for civic engagement or outreach",
            xy=(0.5, 0.03), xycoords='figure fraction', ha='center', fontsize=10, color='gray')
ax.axis('off')
plt.tight_layout()
plt.show()

# --- Folium Map for Web ---
m = folium.Map(location=[40.7128, -74.0060], zoom_start=10)
folium.Choropleth(
    geo_data="nyc_data.geojson",
    name="Strategic Index",
    data=boroughs,
    columns=["borough", "normalized_weight"],
    key_on="feature.properties.BoroName",
    fill_color="YlGn",
    fill_opacity=0.7,
    line_opacity=0.3,
    legend_name="Strategic Opportunity Index (0.0 – 1.0)",
).add_to(m)

# Add dummy layer for interaction (you can replace with real fields later)
tooltip = GeoJsonTooltip(fields=["BoroName"], aliases=["Borough"])
popup = GeoJsonPopup(fields=[], aliases=[])

layer = GeoJson(
    "nyc_data.geojson",
    name="Opportunity Districts",
    tooltip=tooltip,
    popup=popup,
    style_function=lambda x: {
        "fillColor": "#3186cc",
        "color": "black",
        "weight": 1,
        "fillOpacity": 0.6
    }
)
layer.add_to(m)
folium.LayerControl().add_to(m)
m.save("output/nyc-vote-heatmap.html")

# --- Plotly Animated Map ---
data = pd.DataFrame({
    "borough": ["Bronx","Brooklyn","Manhattan","Queens","Staten Island"]*4,
    "year": [2021,2022,2023,2024]*5,
    "turnout": [0.19,0.20,0.22,0.24, 0.27,0.28,0.30,0.32, 0.33,0.34,0.35,0.36, 0.25,0.26,0.27,0.29, 0.22,0.23,0.24,0.26]
})
animated_df = boroughs.merge(data, left_on="BoroName", right_on="borough")

fig = px.choropleth(
    animated_df,
    geojson=animated_df.geometry,
    locations=animated_df.index,
    color="turnout",
    animation_frame="year",
    scope="usa",
    center={"lat": 40.73, "lon": -73.93},
    labels={"turnout": "Turnout Rate"}
)
fig.update_geos(fitbounds="locations", visible=False)
fig.update_layout(title="NYC Borough Turnout 2021–2024")
fig.show()
