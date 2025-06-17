# MapTheVote2025 NYC: Strategic Voting Landscape Tool

A data-driven tool to visualize and identify high-impact voter engagement zones across NYC.  
Built to support civic action, outreach strategy, and increase turnout in the 2025 mayoral election.

![NYC Voter Heatmap](images/nyc-vote-heatmap.png)

##  What It Does

- Maps voter demographics like age, education, and unaffiliated status
- Calculates a “Strategic Engagement Index” by borough
- Visualizes opportunity using a red–green heatmap
- Empowers campaigns, nonprofits, and communities to focus efforts

## Features

- Real turnout and census-based borough data
- GeoJSON integration and easy-to-read matplotlib visuals
- Easy to modify, plug in new data, or export

## Run It Locally

```bash
git clone https://github.com/yourname/CivicScope-NYC.git
cd CivicScope-NYC
python3 -m venv civicenv && source civicenv/bin/activate
pip install -r requirements.txt
python main.py
