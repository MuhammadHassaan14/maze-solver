import sys
import os

# Tell Python to look in this exact folder for modules like 'maze' and 'astar'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from flask import Flask, jsonify
from flask_cors import CORS
from maze import generate_maze
from astar import astar

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

def get_solvable_maze(rows=20, cols=20):
    """
    Generates a maze and ensures it has a valid path from start to goal.
    """
    start = (0, 0)
    goal = (rows - 1, cols - 1)
    
    while True:
        grid = generate_maze(rows, cols)
        path, visited = astar(grid, start, goal)
        if path:
            return grid, path, visited

@app.route('/api/solve', methods=['GET'])
def solve():
    """
    API endpoint to get a solvable maze and its solution.
    """
    grid, path, visited = get_solvable_maze(20, 20)
    
    return jsonify({
        "grid": grid,
        "path": path,
        "visited": visited
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
