import pandas as pd
from sqlalchemy import create_engine

# Your Neon connection string (remove channel binding)
db_url = "postgresql+psycopg2://neondb_owner:npg_q2XRW3bhOVSF@ep-divine-fog-ah0jvjnf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Read the CSV
csv_path = "data/playerstats_1966_raw.csv"
df = pd.read_csv(csv_path)

# Create a database connection
engine = create_engine(db_url)

# Upload data to the table (append mode)
df.to_sql("player_stats", engine, if_exists="append", index=False)

print(f"✅ Uploaded {len(df)} rows from {csv_path} into 'player_stats' table.")

