import time

def get_sequences(buffer_size, axis, index, coordinate_used, row_size, col_size):
    next_moves = [(index, i+1) if axis == 'x' else (i+1, index) for i in range(col_size if axis=='x'else row_size)]

    if buffer_size == 1:
        return [[n] for n in next_moves]
    else:
        result = []
        for row, col in next_moves:
            if (row, col) not in coordinate_used:
                updated_coordinate_used = set(coordinate_used)
                updated_coordinate_used.add((row, col))
                sequences = get_sequences(buffer_size - 1, 'y' if axis == 'x' else 'x', col if axis == 'x' else row, updated_coordinate_used, row_size, col_size)
                result.extend([[(row, col)] + seq for seq in sequences])
        return result


def evaluate(seqs, matrix, targets):
    strings = [''.join(matrix[y-1][x-1] for x, y in seq) for seq in seqs]
    target_strings = [''.join(target['sequence']) for target in targets]

    max_score = 0
    result = []
    full_score = sum(targets[i]['points'] for i in range(len(targets)))


    for string_index, string_value in enumerate(strings):
        score = 0
        seq_length = 0
        matched_index = []

        for i, ts in enumerate(target_strings):
            location = string_value.find(ts)
            if location > -1:
                score += targets[i]['points']

                end_location = location + len(ts)
                seq_length = max(seq_length, end_location)
                matched_index.append(i)
        if score == full_score:
            return [{'seq': seqs[string_index], 'matchedIndices': matched_index}]
        max_score = max(score, max_score)
        result.append({'score': score, 'stringIndex': string_index, 'seqLength': seq_length, 'matchedIndices': matched_index})
        

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

def breach_protocol_solve(matrix, targets, total_buffer_size):
    start_time = time.time()

    sequences = get_sequences(total_buffer_size, 'x', 1, set(),6,6)
    results = evaluate(sequences, matrix, targets)

    seq = results[0]['seq']
    matched_index = results[0]['matchedIndices']

    points = sum(targets[i]['points'] for i in matched_index)

    print(f"Sequence: {seq}, Points: {points}")

    for step, (x, y) in enumerate(seq):
            print(f"Step {step + 1}: Matrix[{y-1}][{x-1}] = {matrix[y-1][x-1]}")

    end_time = time.time()
    runtime = end_time - start_time
    print(f"Runtime: {runtime} seconds")

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
