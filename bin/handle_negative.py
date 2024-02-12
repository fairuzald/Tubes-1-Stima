import time

# The working principle involves BFS using a stack, where registers are pushed at the same buffer level and popped upon decrementing the buffer.
# The avoidance of recursion is due to concerns about the potential heaviness for large buffer and matrix sizes. 
def get_sequences_candidate(buffer, axis, current_position, col_matrix, row_matrix):
    # Initialize push stack and result candidate
    stack = [(buffer, axis, current_position, ())]
    result = []
    while stack:
        # Pop to get the data
        buffer, axis, current_position, sequence = stack.pop()
        # Generate possible next move
        next_moves = [(i + 1, current_position) if axis == 'x' else (current_position, i + 1) for i in range(col_matrix if axis == 'x' else row_matrix)]
        # Last buffer attempt
        if buffer == 1:
            result.extend([sequence + ((x, y),) for x, y in next_moves if (x, y) not in sequence])
        else:
            for x, y in next_moves:
                # Prevent push itself
                if (x, y) not in sequence:
                    stack.append((buffer - 1, ('y' if axis == 'x' else 'x'), (x if axis == 'x' else y), sequence + ((x, y),)))
    return result

def mini_case_evaluate(seqs, matrix, targets):
    strings = [''.join(matrix[y-1][x-1] for x, y in seq) for seq in seqs]
    target_strings = [''.join(target['sequence']) for target in targets]

    max_score = -99999999999
    result = []
    full_score = sum(targets[i]['points'] for i in range(len(targets)))
    found = False

    for string_index, string_value in enumerate(strings):
        score = -99999999999
        seq_length = 0
        matched_index = []

        for i, ts in enumerate(target_strings):
            location = string_value.find(ts)
            if location > 0:
                score += targets[i]['points']
                end_location = location + len(ts)
                seq_length = max(seq_length, end_location)
                matched_index.append(i)
                found = True
                
        if score == full_score and full_score > 0:
            return [{'seq': seqs[string_index], 'matchedIndices': matched_index}]
        
        max_score = max(score, max_score)
        
        result.append({'score': score, 'stringIndex': string_index, 'seqLength': seq_length, 'matchedIndices': matched_index})
    
    if (not found):
        return [{'seq':()}]
    with_max_scores = [entry for entry in result if entry['score'] == max_score]
    min_seq_length = min(entry['seqLength'] for entry in with_max_scores)
    finals = [entry for entry in with_max_scores if entry['seqLength'] == min_seq_length]
    min_seq_length = int(min_seq_length / 2)

    seen_seqs = set()
    unique_pre_chosen = []

    for entry in ({'seq': seqs[entry['stringIndex']][:min_seq_length], 'matchedIndices': entry['matchedIndices']} for entry in finals):
        current_seq = tuple(entry['seq'])
        if current_seq not in seen_seqs:
            seen_seqs.add(current_seq)
            unique_pre_chosen.append(entry)

    return unique_pre_chosen

def breach_protocol_solve(matrix, targets, total_buffer_size, row_matrix, col_matrix):
    start_time = time.time()

    sequences = get_sequences_candidate(total_buffer_size, 'x', 1, row_matrix, col_matrix)
    results =  mini_case_evaluate(sequences, matrix, targets)
    print(results)
   
    

    end_time = time.time()
    runtime = end_time - start_time
    print(f"Runtime: {runtime} seconds")

# Example usage with targets containing sequences and points
targets = [
    {'sequence': ['B', 'D', 'E', '9', '1', 'C'], 'points': 0},
    {'sequence': ['B', 'D', '7', 'A', 'B', 'D'], 'points': 0},
    {'sequence': ['B', 'D', '1', 'C', 'B', 'D',"5","5"], 'points': -1},
]
# targets = [
#     {'sequence': ['H', 'D', 'E', '9', '1', 'C'], 'points': 0},
#     {'sequence': ['H', 'D', '7', 'A', 'H', 'D'], 'points': 0},
#     {'sequence': ['H', 'D', '1', 'C', 'H', 'D',"5","5"], 'points': -1},
# ]

matrix = [
    ['7A', '55', 'E9', 'E9', '1C', '55'],
    ['55', '7A', '1C', '7A', 'E9', '55'],
    ['55', '1C', '1C', '55', 'E9', 'BD'],
    ['BD', '1C', '7A', '1C', '55', 'BD'],
    ['BD', '55', 'BD', '7A', '1C', '1C'],
    ['1C', '55', '55', '7A', '55', '7A'],
]

total_buffer_size = 7

breach_protocol_solve(matrix, targets, total_buffer_size,6,6)
