import random

def generate_maze(rows, cols, wall_probability=0.3):
    """
    Generates a simple maze represented as a 2D grid.
    0 = Path, 1 = Wall.
    Ensures start (0,0) and goal (rows-1, cols-1) are always 0.
    """
    # Initialize grid with all paths
    grid = [[0 for _ in range(cols)] for _ in range(rows)]
    
    for r in range(rows):
        for c in range(cols):
            # Skip start and goal
            if (r == 0 and c == 0) or (r == rows - 1 and c == cols - 1):
                continue
            
            # Randomly place a wall
            if random.random() < wall_probability:
                grid[r][c] = 1
                
    return grid

def print_maze(grid):
    """
    Helper function to print the maze to the console.
    """
    for row in grid:
        print(" ".join(str(cell) for cell in row))

if __name__ == "__main__":
    # Test example
    rows, cols = 10, 10
    maze = generate_maze(rows, cols)
    
    print(f"Generated {rows}x{cols} Maze:")
    print_maze(maze)
    
    # Check start and goal
    assert maze[0][0] == 0, "Start must be free"
    assert maze[rows-1][cols-1] == 0, "Goal must be free"
    print("\nValidation: Start and Goal are free.")
