import time

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

    def evaluate(self,seqs, matrix, targets):
        # Initialize object to minimize calculation
        strings = [{'index': i, 'string': ''.join(matrix[y-1][x-1] for x, y in seq)} for i, seq in enumerate(seqs)]
        
        # Create set of 
        ustrings = set(entry['string'] for entry in strings)
        
        # Create a mapping between unique strings and their original indices
        ustrings_indices = {entry['string']: entry['index'] for entry in strings}
        
        # Join the sequence become string
        target_strings = [''.join(target.sequence) for target in targets]
        
        # Initalize max_score, results, and full_score 
        max_score = 0
        result = []
        full_score = sum(targets[i].points for i in range(len(targets)))

        # Evaluate only set string 
        for ustring in ustrings:
            string_index = ustrings_indices[ustring]
            
            score = 0
            seq_length = 0
            matched_index = []

            for i, target_string in enumerate(target_strings):
                # Search the start location where same value
                location = ustring.find(target_string)
                # If found
                if location > -1:
                    score += targets[i].points
                    end_location = location + len(target_string)
                    seq_length = max(seq_length, end_location)
                    matched_index.append(i)

            if score == full_score:
                return [{'seq': seqs[string_index],"score":score, "string":ustring}]

            max_score = max(score, max_score)
            result.append({'score': score, 'stringIndex': string_index, 'seqLength': seq_length, 'score':score,"string":ustring})

        # Evaluate in array the sequence with max score and min sequence length
        with_max_scores = [entry for entry in result if entry['score'] == max_score]
        min_seq_length = min(entry['seqLength'] for entry in with_max_scores)
        finals = [entry for entry in with_max_scores if entry['seqLength'] == min_seq_length]
        
        # Each 2 char string seq is 1 position
        min_seq_length = int(min_seq_length / 2)

        seen_seqs = set()
        unique_pre_chosen = []

        # Minimize unused chars of string become set
        for entry in ({'seq': seqs[entry['stringIndex']][:min_seq_length],'score':entry["score"],"string":entry["string"]} for entry in finals):
            current_seq = tuple(entry['seq'])
            if current_seq not in seen_seqs:
                seen_seqs.add(current_seq)
                unique_pre_chosen.append(entry)

        return unique_pre_chosen


    def breach_protocol_solve(self, matrix, targets, total_buffer_size, row_matrix, col_matrix):
        try:
            start_time = time.time()

            sequences = self.get_sequences_candidate(total_buffer_size, 'x', 1, col_matrix, row_matrix)
            results = self.evaluate(sequences, matrix, targets)

            end_time = time.time()
            runtime = end_time - start_time
            return {'results': results[0] if (len(results) > 0) else [], 'runtime': runtime}
        except Exception as e:
            print(f"An error occurred: {e}")
            return {'error': str(e)}
