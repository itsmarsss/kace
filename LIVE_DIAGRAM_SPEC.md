# Live Diagram Generation Specification

## Overview
As users type their reasoning, the diagram view updates live every 10-15 seconds by sending snapshots to Claude API.

## Architecture

### 1. Snapshot Capture
**Timing:** Every 12 seconds after user stops typing (debounced)
**Minimum text length:** 50 characters
**Captured data:**
- Current reasoning text
- Selected drug treatments
- Confidence level
- Timestamp

### 2. Context Building
Each API call includes:
```typescript
{
  previousText: string        // Last snapshot sent
  newText: string            // Current snapshot
  textDiff: string           // Human-readable diff
  currentDiagram: Block[]    // Existing diagram blocks
  selectedDrugs: string[]    // Selected treatments
  confidence: number         // User's confidence (1-5)
  timestamp: number          // When snapshot was taken
}
```

### 3. Claude API Prompt Structure

```
You are analyzing a clinician's reasoning process in real-time.

## Context
- Patient case: [case details]
- Previous reasoning: [previousText]
- New reasoning added: [textDiff]
- Current diagram: [JSON of existing blocks]

## Current Input
- Full reasoning: [newText]
- Selected treatments: [selectedDrugs]
- Confidence: [confidence]/5

## Task
Update the reasoning diagram to reflect the new information. You may:
1. Add new blocks if new reasoning steps are introduced
2. Modify existing blocks if reasoning is refined
3. Remove blocks if reasoning is retracted
4. Adjust connections to show updated logical flow

Return ONLY the updated blocks array in JSON format.
Maintain consistency with existing block IDs where possible.
```

### 4. Diagram Update Strategy

**Merge Logic:**
1. Keep existing blocks that are still relevant
2. Add new blocks for new reasoning
3. Update modified blocks (match by ID or content similarity)
4. Remove blocks that are no longer supported
5. Update all connections (`connects_to` arrays)

**Visual Feedback:**
- Show subtle loading indicator while generating
- Animate in new blocks with fade/scale
- Highlight updated blocks briefly
- Smooth transitions for removed blocks

### 5. State Management

**ModeProvider additions:**
```typescript
interface ModeState {
  // ... existing state
  isLiveGenerating: boolean      // Currently calling API
  lastSnapshotTime: number       // When last snapshot was sent
  diagramVersion: number         // Increment on each update
}

// New actions
type ModeAction =
  | { type: 'START_LIVE_GENERATION' }
  | { type: 'UPDATE_DIAGRAM'; payload: Block[] }
  | { type: 'LIVE_GENERATION_FAILED'; error: string }
```

### 6. Error Handling

**Failures:**
- Network errors: Retry with exponential backoff (max 3 attempts)
- API errors: Show subtle notification, don't block user
- Invalid responses: Keep previous diagram, log error

**Rate Limiting:**
- Max 1 request every 10 seconds
- Queue snapshots if API is slow (drop old queued snapshots)

### 7. Performance Considerations

**Optimizations:**
- Don't send identical snapshots (check hash)
- Cancel in-flight requests if new snapshot is ready
- Use streaming API if available for faster feedback
- Cache API responses locally (keyed by text hash)

## Implementation Checklist

- [x] Create `useLiveDiagram` hook with throttling
- [ ] Add Claude API integration
- [ ] Implement diagram merge logic
- [ ] Add visual feedback (loading states)
- [ ] Handle error cases gracefully
- [ ] Add unit tests for diff computation
- [ ] Add integration tests for snapshot flow
- [ ] Performance testing with long text
- [ ] Add user settings (enable/disable, adjust interval)

## Future Enhancements

1. **User Controls:**
   - Toggle live generation on/off
   - Adjust snapshot interval (10s / 15s / 20s)
   - Manual "generate now" button

2. **Advanced Diffing:**
   - Semantic diff (not just text diff)
   - Highlight specific changes in reasoning
   - Show which blocks changed and why

3. **Collaboration:**
   - Multiple users viewing same live diagram
   - Show who made which reasoning changes
   - Branching diagrams for different approaches
