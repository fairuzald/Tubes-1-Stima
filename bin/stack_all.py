import time

# The working principle involves DFS using a stack, where registers are pushed at the same buffer level and popped upon decrementing the buffer.
# The avoidance of recursion is due to concerns about the potential heaviness for large buffer and matrix sizes. 
def get_sequences_candidate(buffer, axis, current_position, col_matrix, row_matrix):
    stack = [(buffer, axis, current_position, ())]
    result = []

    while stack:
        buffer, axis, current_position, sequence = stack.pop()

        next_move = [(i + 1, current_position) if axis == 'x' else (current_position, i + 1) for i in range(col_matrix if axis == 'x' else row_matrix)]

        if buffer == 1:
            result.extend([sequence + ((x, y),) for x, y in next_move if (x, y) not in sequence])
        else:
            for x, y in next_move:
                if (x, y) not in sequence:
                    stack.append((buffer - 1, ('y' if axis == 'x' else 'x'), (x if axis == 'x' else y), sequence + ((x, y),)))

    return result

def evaluate(self, seqs, matrix, targets):
        # Initialize object to minimize calculation
        strings = [{'index': i, 'string': ''.join(matrix[y-1][x-1] for x, y in seq)} for i, seq in enumerate(seqs)]
        
        # Create set of 
        ustrings = set(entry['string'] for entry in strings)
        
        # Create a mapping between unique strings and their original indices
        ustrings_indices = {entry['string']: entry['index'] for entry in strings}
        
        # Join the sequence become string
        target_strings = [''.join(target.sequence) for target in targets]
        
        # Initalize max_score, results, and full_score 
        max_score = float('-inf')
        result = []
        full_score = sum(targets[i].points for i in range(len(targets)))
        found = False
        
        # Evaluate only set string 
        for ustring in ustrings:
            string_index = ustrings_indices[ustring]
            score = float('-inf')
            
            seq_length = 0

            for i, target_string in enumerate(target_strings):
                # Search the start location where the same value
                location = ustring.find(target_string)
                # If found
                if location > -1:
                    score += targets[i].points
                    end_location = location + len(target_string)
                    seq_length = max(seq_length, end_location)
                    found = True

            if score == full_score and full_score > 0:
                return [{'seq': seqs[string_index], "score": score, "string": ustring}]

            max_score = max(score, max_score)
            result.append({'score': score, 'stringIndex': string_index, 'seqLength': seq_length, 'score': score, "string": ustring})
            
        print(max_score)
        
        if(found==False):
            return [{'seq': (), 'score': -1, 'string': ""}]
        
        # Evaluate in array the sequence with max score and min sequence length
        with_max_scores = [entry for entry in result if entry['score'] == max_score]

        min_seq_length = min(entry['seqLength'] for entry in with_max_scores)
        finals = [entry for entry in with_max_scores if entry['seqLength'] == min_seq_length]
        
        # Each 2 char string seq is 1 position
        min_seq_length = int(min_seq_length / 2)

        seen_seqs = set()
        unique_pre_chosen = []

        # Minimize unused chars of string become set
        for entry in ({'seq': seqs[entry['stringIndex']][:min_seq_length], 'score': entry["score"], "string": entry["string"]} for entry in finals):
            current_seq = tuple(entry['seq'])
            if current_seq not in seen_seqs:
                seen_seqs.add(current_seq)
                unique_pre_chosen.append(entry)
                
        return unique_pre_chosen


def breach_protocol_solve(matrix, targets, total_buffer_size):
    start_time = time.time()

    sequences = get_sequences_candidate(total_buffer_size, 'x', 1,6,6)
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
