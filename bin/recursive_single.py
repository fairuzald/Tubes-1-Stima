import time

def solution(buffer, axis, current_position, col_matrix, row_matrix, targets, matrix):
    sequences = get_sequences(buffer, axis, current_position, set(), row_matrix, col_matrix)
    max_score = 0
    last_seq = None
    full = sum(targets[i]['points'] for i in range(len(targets)))

    for seq in sequences:
        sol = single_evaluate(seq, matrix, targets)
        if(sol['score'] == full):
            return sol
        
        if sol['score'] > max_score:
            max_score = max(max_score,sol["score"])
            last_seq = sol
    return sol

def get_sequences(buffer_size, move_orientation, index, used, row_size, col_size):
    next_moves = [(index, i+1) if move_orientation == 'x' else (i+1, index) for i in range(col_size if move_orientation=='x'else row_size)]

    if buffer_size == 1:
        return [[n] for n in next_moves]
    else:
        result = []
        for row, col in next_moves:
            if (row, col) not in used:
                updated_used = set(used)
                updated_used.add((row, col))
                sequences = get_sequences(buffer_size - 1, 'y' if move_orientation == 'x' else 'x', col if move_orientation == 'x' else row, updated_used, row_size, col_size)
                result.extend([[(row, col)] + seq for seq in sequences])
        return result

def single_evaluate(seq, matrix, targets):
    strings = ''.join(matrix[y-1][x-1] for x, y in seq)
    target_strings = [''.join(target['sequence']) for target in targets]

    score = 0
    matched_index = []

    for i, ts in enumerate(target_strings):
        location = strings.find(ts)
        if location > -1:
            score += targets[i]['points']
            matched_index.append(i)

    return {"seq": seq, "score": score, "matchedIndices": matched_index}

def breach_protocol_solve(matrix, targets, total_buffer_size):
    start_time = time.time()

    sequences = solution(total_buffer_size, 'x', 1, 6, 6, targets, matrix)
    
    seq = sequences['seq']

    points = sequences["score"]

    print(f"Sequence: {seq}, Points: {points}")

    for step, (x, y) in enumerate(seq):
            print(f"Step {step + 1}: Matrix[{y-1}][{x-1}] = {matrix[y-1][x-1]}")

    end_time = time.time()
    runtime = end_time - start_time
    print(f"Runtime: {runtime} seconds")

# Example usage with targets containing sequences and points
targets = [
    {'sequence': ['B', 'D', 'E', '9', '1', 'C'], 'points': 15},
    {'sequence': ['B', 'D', '7', 'A', 'B', 'D'], 'points': 20},
    {'sequence': ['B', 'D', '1', 'C', 'B', 'D',"5","5"], 'points': 30},
]

matrix = [
    ['7A', '55', 'E9', 'E9', '1C', '55'],
    ['55', '7A', '1C', '7A', 'E9', '55'],
    ['55', '1C', '1C', '55', 'E9', 'BD'],
    ['BD', '1C', '7A', '1C', '55', 'BD'],
    ['BD', '55', 'BD', '7A', '1C', '1C'],
    ['1C', '55', '55', '7A', '55', '7A']
]
total_buffer_size = 7

breach_protocol_solve(matrix, targets, total_buffer_size)
