import time

class BreachProtocolSolver:
    def get_sequences_candidate(self, buffer, axis, current_position, col_matrix, row_matrix):
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
        strings = [''.join(matrix[y-1][x-1] for x, y in seq) for seq in seqs]
        target_strings = [''.join(target.sequence) for target in targets]

        max_score = 0
        result = []

        for string_index, string_value in enumerate(strings):
            score = 0
            seq_length = 0
            matched_index = []

            for i, ts in enumerate(target_strings):
                location = string_value.find(ts)
                if location > -1:
                    score += targets[i].points

                    end_location = location + len(ts)
                    seq_length = max(seq_length, end_location)
                    matched_index.append(i)

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


    def breach_protocol_solve(self, matrix, targets, total_buffer_size, row_matrix, col_matrix):
        try:
            start_time = time.time()

            sequences = self.get_sequences_candidate(total_buffer_size, 'x', 1, row_matrix, col_matrix)
            results = self.evaluate(sequences, matrix, targets)
            
            

            end_time = time.time()
            runtime = end_time - start_time
            return {'results': results, 'runtime': runtime}
        except Exception as e:
            print(f"An error occurred: {e}")
            return {'error': str(e)}
