import time

def solution(buffer, axis, current_position, col_matrix, row_matrix, targets, matrix):
    stack = [(buffer, axis, current_position, ())]
    full = sum(targets[i]['points'] for i in range(len(targets)))
    last_seq = {}
    max_score = 0
    while stack:
        buffer, axis, current_position, sequence = stack.pop()

        sol = single_evaluate(sequence, matrix, targets)
        
        if sol['score'] == full:
            stack = []
            return sol
        else:
            if(sol['score']>max_score):
                max_score = max(max_score, sol['score'])
                last_seq = sol

            next_move = [(i + 1, current_position) if axis == 'x' else (current_position, i + 1) for i in range(col_matrix if axis == 'x' else row_matrix)]
            if buffer !=-1:
                for x, y in next_move:
                    if (x, y) not in sequence:
                        stack.append((buffer - 1, ('y' if axis == 'x' else 'x'), (x if axis == 'x' else y), sequence + ((x, y),)))
    return last_seq

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
    matched_index = sequences['matchedIndices']

    points = sum(targets[i]['points'] for i in matched_index)

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