import { DiagramBlock } from '../services/api'

export interface ComparisonResult {
  userTrace: ComparisonNode[]
  expertTrace: ComparisonNode[]
  alignment: number // 0-100
  insights: string[]
}

export interface ComparisonNode {
  type: 'match' | 'miss' | 'extra'
  blockType: string
  title: string
  body: string
  matchedWith?: string // ID of matched block
}

/**
 * Compare user's reasoning diagram with expert reasoning
 * Returns a structured comparison showing matches, misses, and insights
 */
export function compareReasoning(
  userBlocks: DiagramBlock[],
  expertBlocks: DiagramBlock[]
): ComparisonResult {
  const userTrace: ComparisonNode[] = []
  const expertTrace: ComparisonNode[] = []
  const matchedExpertIds = new Set<string>()
  const matchedUserIds = new Set<string>()

  // Find matches between user and expert blocks
  // Simple matching based on similar titles or overlapping concepts
  for (const userBlock of userBlocks) {
    let bestMatch: { block: DiagramBlock; score: number } | null = null

    for (const expertBlock of expertBlocks) {
      if (matchedExpertIds.has(expertBlock.id)) continue

      // Calculate similarity score
      const score = calculateSimilarity(userBlock, expertBlock)

      if (score > 0.4 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { block: expertBlock, score }
      }
    }

    if (bestMatch) {
      // Found a match
      matchedExpertIds.add(bestMatch.block.id)
      matchedUserIds.add(userBlock.id)

      userTrace.push({
        type: 'match',
        blockType: userBlock.type,
        title: userBlock.title,
        body: userBlock.body,
        matchedWith: bestMatch.block.id,
      })
    } else {
      // User mentioned something expert didn't emphasize
      userTrace.push({
        type: 'extra',
        blockType: userBlock.type,
        title: userBlock.title,
        body: userBlock.body,
      })
    }
  }

  // Find expert blocks that user missed
  for (const expertBlock of expertBlocks) {
    if (matchedExpertIds.has(expertBlock.id)) {
      expertTrace.push({
        type: 'match',
        blockType: expertBlock.type,
        title: expertBlock.title,
        body: expertBlock.body,
        matchedWith: expertBlock.id,
      })
    } else {
      expertTrace.push({
        type: 'miss',
        blockType: expertBlock.type,
        title: expertBlock.title,
        body: expertBlock.body,
      })
    }
  }

  // Calculate alignment percentage
  const matches = matchedUserIds.size
  const total = Math.max(userBlocks.length, expertBlocks.length)
  const alignment = total > 0 ? Math.round((matches / total) * 100) : 0

  // Generate insights based on comparison
  const insights = generateInsights(userBlocks, expertBlocks, matchedUserIds, matchedExpertIds)

  return {
    userTrace,
    expertTrace,
    alignment,
    insights,
  }
}

/**
 * Calculate similarity between two blocks
 * Returns a score from 0 to 1
 */
function calculateSimilarity(block1: DiagramBlock, block2: DiagramBlock): number {
  // Same type increases similarity
  const typeMatch = block1.type === block2.type ? 0.3 : 0

  // Compare titles using word overlap
  const title1Words = new Set(block1.title.toLowerCase().split(/\s+/))
  const title2Words = new Set(block2.title.toLowerCase().split(/\s+/))

  const titleOverlap = [...title1Words].filter((word) => title2Words.has(word)).length
  const titleSimilarity = titleOverlap / Math.max(title1Words.size, title2Words.size)

  // Compare bodies using word overlap
  const body1Words = new Set(block1.body.toLowerCase().split(/\s+/))
  const body2Words = new Set(block2.body.toLowerCase().split(/\s+/))

  const bodyOverlap = [...body1Words].filter((word) => body2Words.has(word)).length
  const bodySimilarity = bodyOverlap / Math.max(body1Words.size, body2Words.size)

  return typeMatch + titleSimilarity * 0.4 + bodySimilarity * 0.3
}

/**
 * Generate insights based on the comparison
 */
function generateInsights(
  userBlocks: DiagramBlock[],
  expertBlocks: DiagramBlock[],
  matchedUserIds: Set<string>,
  matchedExpertIds: Set<string>
): string[] {
  const insights: string[] = []

  // Check for missed critical observations
  const missedCritical = expertBlocks.filter(
    (b) => !matchedExpertIds.has(b.id) && (b.type === 'OBSERVATION' || b.type === 'DECISION')
  )

  if (missedCritical.length > 0) {
    insights.push(
      `Consider incorporating: ${missedCritical.map((b) => b.title.toLowerCase()).join(', ')}`
    )
  }

  // Check for good pattern matching
  const matchRate = matchedUserIds.size / userBlocks.length
  if (matchRate > 0.7) {
    insights.push('Your reasoning aligns well with expert clinical thinking patterns.')
  }

  // Check for comprehensive reasoning
  const hasAllTypes = ['OBSERVATION', 'INTERPRETATION', 'CONSIDERATION', 'DECISION'].every((type) =>
    userBlocks.some((b) => b.type === type)
  )

  if (hasAllTypes) {
    insights.push('You demonstrated comprehensive clinical reasoning across all key domains.')
  }

  return insights
}
