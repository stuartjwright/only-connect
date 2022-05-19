import random
from uuid import uuid4
from collections import defaultdict
from data import get_random_wall


class Wall:
    def __init__(self):
        """Initialise object with a randomly selected grid."""
        data = get_random_wall()
        groups = defaultdict(set)
        grid = []
        for i, group in enumerate(data):
            for j, item in enumerate(group['items']):
                item_id = i*4 + j
                grid.append({'id': item_id, 'group': i, 'item': item})
                groups[i].add(item_id)
        self.connections = [group['connection'] for group in data]

        random.shuffle(grid)

        self.grid = grid
        self.groups = groups
        self.solved = set()
        self.lives = 3
        self.complete = False
        self.frozen = False
        self.wall_id = str(uuid4())

    def guess(self, ids):
        """Receives list of 4 item IDs from user, representing their guess."""
        if self.complete:
            return

        guess = set(ids)
        is_correct = False
        for group_id, group in self.groups.items():
            if guess == group:
                is_correct = True
                break

        if is_correct:
            self.update_grid(group_id)
        elif len(self.solved) == 2:
            self.lives -= 1
            if self.lives <= 0:
                self.freeze()

    def freeze(self):
        self.frozen = True

    def update_grid(self, group_id):
        """Updates object's after a correct guess"""
        already_solved = [row for row in self.grid if row['group'] in self.solved]
        newly_solved = [row for row in self.grid if row['group'] == group_id]
        unsolved = [row for row in self.grid if row['group'] != group_id and row['group'] not in self.solved]
        self.grid = already_solved + newly_solved + unsolved
        self.solved.add(group_id)
        if len(self.solved) == 3:
            remaining = [i for i in range(4) if i not in self.solved][0]
            self.update_grid(remaining)
        if len(self.solved) >= 4:
            self.complete = True

    def set_complete(self):
        for group_id in range(4):
            if group_id not in self.solved and not self.complete:
                self.update_grid(group_id)

    def get_dict(self) -> dict:
        """Returns dict representation of object to be sent as JSON response to frontend"""
        d = self.__dict__.copy()
        d['solved'] = list(d['solved'])
        d['groups'] = {group: list(items) for group, items in d['groups'].items()}
        return d


if __name__ == '__main__':
    wall = Wall()
    wall.guess([0, 1, 2, 4])  # wrong guess
    wall.guess([4, 5, 6, 7])  # correct guess, solved group moved to start
    wall.guess([12, 13, 14, 15])  # correct guess, solved group moved to second row
    wall.guess([0, 1, 8, 9])  # wrong guess, lose a life because only two groups remaining
    d = wall.__dict__
