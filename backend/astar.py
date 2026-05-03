import heapq

def heuristic(a, b):
    """
    Calculates the Manhattan distance between two points a and b.
    Used as the heuristic (h) for A*.
    """
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar(grid, start, goal):
    """
    A* Search Algorithm implementation.
    Returns:
        path: List of coordinates from start to goal.
        visited: List of coordinates in the order they were explored.
    """
    rows = len(grid)
    cols = len(grid[0])
    
    # Priority Queue stores (priority, current_node)
    # priority = g_score (dist from start) + h_score (est. dist to goal)
    pq = [(0, start)]
    
    # Track the cost from start to a node
    g_score = {start: 0}
    
    # Track which node we came from to reconstruct the path
    came_from = {}
    
    # Track order of exploration for visualization
    visited = []
    
    # Set of nodes currently in the priority queue for quick lookups
    in_pq = {start}

    while pq:
        # Get node with the lowest f_score (priority)
        current_f, current = heapq.heappop(pq)
        in_pq.remove(current)
        
        visited.append(current)

        # Goal reached
        if current == goal:
            return reconstruct_path(came_from, current), visited

        # Check neighbors (Up, Down, Left, Right)
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            neighbor = (current[0] + dx, current[1] + dy)

            # Check boundaries and obstacles (1 = wall, 0 = path)
            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols:
                if grid[neighbor[0]][neighbor[1]] == 1:
                    continue
                
                # Calculate tentative g_score
                tentative_g = g_score[current] + 1
                
                # If this path is better than any previous one
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + heuristic(neighbor, goal)
                    
                    if neighbor not in in_pq:
                        heapq.heappush(pq, (f_score, neighbor))
                        in_pq.add(neighbor)

    # No path found
    return [], visited

def reconstruct_path(came_from, current):
    """
    Backtracks from the goal to the start using the came_from map.
    """
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1] # Reverse to get start -> goal

if __name__ == "__main__":
    # Small Test Example
    # 0 = Path, 1 = Wall
    test_grid = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0]
    ]
    
    start_node = (0, 0)
    goal_node = (4, 4)
    
    found_path, nodes_visited = astar(test_grid, start_node, goal_node)
    
    print(f"Path found: {found_path}")
    print(f"Nodes visited count: {len(nodes_visited)}")
    if found_path:
        print("Success: Path reaches goal.")
    else:
        print("Failure: No path found.")
