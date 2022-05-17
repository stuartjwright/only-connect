import os
import random
import pandas as pd


PATH = './data'
FILENAME = 'walls.csv'


def process_group(rows):
    """Function passed to df.groupby.apply to process each wall"""
    wall = []
    for i, row in rows.iterrows():
        items = row[['item_1', 'item_2', 'item_3', 'item_4']].tolist()
        wall.append({'items': items, 'connection': row['connection']})
    return wall


def get_walls():
    """Read wall data from CSV and convert to nested list/dict form."""
    df = pd.read_csv(os.path.join(PATH, FILENAME))
    return df.groupby('wall_id').apply(process_group).to_list()


WALLS = get_walls()


def get_random_wall():
    return random.choice(WALLS)
