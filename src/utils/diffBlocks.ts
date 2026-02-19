import { DiagramBlock } from '../services/types'

export interface BlockComparison {
  match: DiagramBlock[] // Learner blocks that match expert blocks
  miss: DiagramBlock[] // Expert blocks not found in learner's reasoning
  wrong: DiagramBlock[] // Learner blocks that don't match any expert block
  matchPairs: Array<{ learner: DiagramBlock; expert: DiagramBlock; similarity: number }>
}

/**
 * Calculate semantic similarity between two texts
 * Returns a score between 0 and 1
 */
function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (text: string) => text.toLowerCase().trim().replace(/\s+/g, ' ')

  const t1 = normalize(text1)
  const t2 = normalize(text2)

  // Exact match
  if (t1 === t2) return 1.0

  // Calculate word overlap
  const words1 = new Set(t1.split(' '))
  const words2 = new Set(t2.split(' '))

  const intersection = new Set([...words1].filter((word) => words2.has(word)))
  const union = new Set([...words1, ...words2])

  const jaccardSimilarity = intersection.size / union.size

  // Also check for substring containment
  const containmentScore = t1.includes(t2) || t2.includes(t1) ? 0.3 : 0

  return Math.min(1.0, jaccardSimilarity + containmentScore)
}

/**
 * Calculate combined similarity for a block (title + body)
 */
function calculateBlockSimilarity(block1: DiagramBlock, block2: DiagramBlock): number {
  // Must be same type to be considered similar
  if (block1.type !== block2.type) return 0

  const titleSim = calculateSimilarity(block1.title, block2.title)
  const bodySim = calculateSimilarity(block1.body, block2.body)

  // Weighted average: title is more important
  return titleSim * 0.6 + bodySim * 0.4
}

/**
 * Compare learner's blocks with expert's blocks
 * Returns classification of matches, misses, and wrong blocks
 */
export function compareDiagrams(
  learnerBlocks: DiagramBlock[],
  expertBlocks: DiagramBlock[],
  similarityThreshold: number = 0.5
): BlockComparison {
  const match: DiagramBlock[] = []
  const miss: DiagramBlock[] = []
  const wrong: DiagramBlock[] = []
  const matchPairs: Array<{ learner: DiagramBlock; expert: DiagramBlock; similarity: number }> = []

  // Track which expert blocks have been matched
  const matchedExpertIds = new Set<string>()

  // For each learner block, find the best matching expert block
  for (const learnerBlock of learnerBlocks) {
    let bestMatch: { expert: DiagramBlock; similarity: number } | null = null

    for (const expertBlock of expertBlocks) {
      // Skip if this expert block is already matched
      if (matchedExpertIds.has(expertBlock.id)) continue

      const similarity = calculateBlockSimilarity(learnerBlock, expertBlock)

      if (similarity > similarityThreshold && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { expert: expertBlock, similarity }
      }
    }

    if (bestMatch) {
      // Found a match
      match.push(learnerBlock)
      matchedExpertIds.add(bestMatch.expert.id)
      matchPairs.push({
        learner: learnerBlock,
        expert: bestMatch.expert,
        similarity: bestMatch.similarity,
      })
    } else {
      // No match found - this is a wrong/extra block
      wrong.push(learnerBlock)
    }
  }

  // Find expert blocks that weren't matched (missed by learner)
  for (const expertBlock of expertBlocks) {
    if (!matchedExpertIds.has(expertBlock.id)) {
      miss.push(expertBlock)
    }
  }

  return { match, miss, wrong, matchPairs }
}

/**
 * Get a human-readable comparison summary
 */
export function getComparisonSummary(comparison: BlockComparison): string {
  const total = comparison.match.length + comparison.miss.length + comparison.wrong.length
  const matchPercent = total > 0 ? Math.round((comparison.match.length / total) * 100) : 0

  return `${matchPercent}% match (${comparison.match.length} correct, ${comparison.miss.length} missed, ${comparison.wrong.length} incorrect)`
}
