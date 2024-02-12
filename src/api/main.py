import time  # Import the time module for measuring runtime

class BreachProtocolSolver:
    # The working principle involves BFS using a stack, where registers are pushed at the same buffer level and popped upon decrementing the buffer.
    # The avoidance of recursion is due to concerns about the potential heaviness for large buffer and matrix sizes. 
    def get_sequences_candidate(self, buffer, axis, current_position, col_matrix, row_matrix):
        # Initialize push stack and result candidate
        stack = [(buffer, axis, current_position, ())]
        result = []
        while stack:
            # Pop to get the data
            buffer, axis, current_position, sequence = stack.pop()
            # Generate possible next moves
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

    def evaluate(self, seqs, matrix, targets):
        # Initialize object to minimize calculation
        strings = [{'index': i, 'string': ''.join(matrix[y-1][x-1] for x, y in seq)} for i, seq in enumerate(seqs)]

        # Create a set of unique strings
        ustrings = set(entry['string'] for entry in strings)

        # Create a mapping between unique strings and their original indices
        ustrings_indices = {entry['string']: entry['index'] for entry in strings}
        
        # Join the sequence become a string
        target_strings = [''.join(target.sequence) for target in targets]
        
        # Initialize max_score, results, and full_score 
        max_score = float('-inf')
        result = []
        full_score = sum(targets[i].points for i in range(len(targets)))
        found = False
        
        # Evaluate only set string 
        for ustring in ustrings:
            string_index = ustrings_indices[ustring]
            score = 0
            seq_length = 0
            for i, target_string in enumerate(target_strings):
                # If found
                location = ustring.find(target_string)
                if location > 0 or ustring == target_string:
                    score += targets[i].points
                    end_location = location + len(target_string)
                    seq_length = max(seq_length, end_location)
                    if not found:
                        found = True
                    max_score = max(score, max_score)
                    result.append({'stringIndex': string_index, 'seqLength': seq_length, 'score': score, 'string': ustring})

            if score == full_score and full_score > 0:
                return [{'seq': seqs[string_index], 'score': score, 'string': ustring}]
            
        if not found:
            return [{'seq': (), 'score': -1, "string": ""}]
        
        # Evaluate in an array the sequence with max score and min sequence length
        with_max_scores = [entry for entry in result if entry['score'] == max_score]
        min_seq_length = min(entry['seqLength'] for entry in with_max_scores)
        finals = [entry for entry in with_max_scores if entry['seqLength'] == min_seq_length]
        
        if min_seq_length > 1:
            min_seq_length = int(min_seq_length / 2)

            seen_seqs = set()
            unique_pre_chosen = []

            for entry in (
                {'seq': seqs[entry['stringIndex']][:min_seq_length], 'score': entry["score"], "string": entry["string"]}
                for entry in finals
            ):
                current_seq = tuple(entry['seq'])
                if current_seq not in seen_seqs:
                    seen_seqs.add(current_seq)
                    unique_pre_chosen.append(entry)

            return unique_pre_chosen
        return finals

    def mini_case_evaluate(self, seqs, matrix, targets):
        # Extract strings from the matrix based on provided sequences
        strings = [''.join(matrix[y-1][x-1] for x, y in seq) for seq in seqs]

        # Extract target strings from the targets
        target_strings = [''.join(target.sequence) for target in targets]

        # Initialize variables to track maximum score and result
        max_score = float("-inf")
        result = []

        # Calculate the full score based on the points of each target
        full_score = sum(targets[i].points for i in range(len(targets)))

        # Flag to check if any valid sequence is found
        found = False

        # Loop through each string extracted from the matrix
        for string_index, string_value in enumerate(strings):
            score = 0
            seq_length = 0

            # Iterate through target strings and check for matches
            for i, ts in enumerate(target_strings):
                location = string_value.find(ts)
                if location > 0 or string_value == ts:
                    # Update score and sequence length
                    score += targets[i].points
                    end_location = location + len(ts)
                    seq_length = max(seq_length, end_location)

                    if not found:
                        found = True

                    # Update maximum score and append result
                    max_score = max(score, max_score)
                    result.append({'score': score, 'stringIndex': string_index, 'seqLength': seq_length, 'score': score, 'string': string_value})

            # If the score matches the full score and full score is greater than 0, return the result
            if score == full_score and full_score > 0:
                return [{'seq': seqs[string_index], 'score': score, 'string': string_value}]

        # If no valid sequence is found, return a default result
        if not found:
            return [{'seq': (), 'score': -1, "string": ""}]

        # Filter entries with maximum scores
        with_max_scores = [entry for entry in result if entry['score'] == max_score]

        # Find the minimum sequence length among entries with maximum scores
        min_seq_length = min(entry['seqLength'] for entry in with_max_scores)

        # Filter entries with minimum sequence length
        finals = [entry for entry in with_max_scores if entry['seqLength'] == min_seq_length]

        # If minimum sequence length is greater than 1, reduce it to half
        if min_seq_length > 1:
            min_seq_length = int(min_seq_length / 2)
            seen_seqs = set()
            unique_pre_chosen = []
            # Iterate through final entries and filter unique pre-chosen entries
            for entry in (
                {'seq': seqs[entry['stringIndex']][:min_seq_length], 'score': entry["score"], "string": entry["string"]}
                for entry in finals
            ):
                current_seq = tuple(entry['seq'])
                if current_seq not in seen_seqs:
                    seen_seqs.add(current_seq)
                    unique_pre_chosen.append(entry)
            # Return unique pre-chosen entries
            return unique_pre_chosen
        # Return final entries
        return finals

    def breach_protocol_solve(self, matrix, targets, total_buffer_size, row_matrix, col_matrix):
        try:
            start_time = time.time()  # Record the start time
            sequences = self.get_sequences_candidate(total_buffer_size, 'x', 1, col_matrix, row_matrix)
            results = self.evaluate(sequences, matrix, targets) if total_buffer_size >= 8 or row_matrix >= 7 or col_matrix >= 7 else self.mini_case_evaluate(sequences, matrix, targets)
            end_time = time.time()  # Record the end time
            runtime = end_time - start_time  # Calculate the runtime
            return {'results': results[0] if (len(results) > 0) else [], 'runtime': runtime}
        except Exception as e:
            print(f"An error occurred: {e}")
            return {'error': str(e)}
