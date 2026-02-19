# KaCE Setup Guide

## Environment Setup

1. **Create `.env` file** from the example:
   ```bash
   cp .env.example .env
   ```

2. **Add your Anthropic API key** to `.env`:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

   Get your API key from: https://console.anthropic.com/

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Start dev server**:
   ```bash
   pnpm dev
   ```

## Features Implemented

### ✅ Demo Mode
- Incremental reasoning demonstration
- Live diagram building during demo playback
- TTS (text-to-speech) patient audio
- Animated reasoning flow

### ✅ Live Mode
- **Real-time diagram generation** - Diagrams update automatically every 12 seconds as you type
- **Submit reasoning** - Full analysis when you click "Analyze Reasoning"
- **Expert comparison** - Compare your reasoning with expert clinical thinking
- **Confidence calibration** - See how your confidence aligns with correctness

### ✅ API Integration
- Claude API for reasoning analysis
- Structured diagram block extraction
- Incremental diagram updates
- Error handling and retry logic

## How to Use

### Demo Mode (Default)
1. Click "Run Demo" to watch an automated clinical reasoning session
2. Observe how the diagram builds incrementally
3. See the final expert comparison

### Live Mode
1. Switch from demo to live mode (toggle in UI)
2. Read the patient case information
3. Type your clinical reasoning in the textarea
4. Select potential treatments
5. Set your confidence level
6. Click "Analyze Reasoning" to submit
7. View your diagram in Linear (1D) or Graph (2D) layout
8. Click "View Expert Analysis" to compare with expert reasoning

## Architecture

```
src/
├── services/
│   └── api.ts              # Anthropic API client
├── hooks/
│   ├── useAnalysis.ts      # Submission & analysis
│   └── useLiveDiagram.ts   # Live diagram generation
├── utils/
│   └── compareReasoning.ts # Expert comparison logic
└── components/
    ├── patient/            # Patient panel (vitals, history, TTS)
    ├── reasoning/          # Reasoning input panel
    ├── diagram/            # Diagram panel (1D/2D views)
    └── overlay/            # Expert comparison overlay
```

## API Calls

### 1. Submit Reasoning (Full Analysis)
- Triggered: When user clicks "Analyze Reasoning"
- Endpoint: `analyzeReasoning()`
- Model: `claude-3-5-sonnet-20241022`
- Returns: Complete diagram blocks array

### 2. Live Diagram Updates
- Triggered: Every 12 seconds after user stops typing (if >50 chars)
- Endpoint: `updateDiagramIncremental()`
- Model: `claude-3-5-sonnet-20241022`
- Returns: Updated diagram blocks array

## Troubleshooting

### API Key Not Working
- Ensure `.env` file exists in project root
- Check that `VITE_` prefix is included
- Restart dev server after adding key

### Arrows Not Showing in Graph View
- Already fixed! Handles added to React Flow nodes
- If issues persist, check browser console for errors

### Live Diagram Not Updating
- Check that you're in Live mode (not Demo)
- Ensure you've typed at least 50 characters
- Wait 12 seconds after stopping typing
- Check browser console for API errors

## Next Steps

### Potential Enhancements
- [ ] Add user settings for live diagram interval
- [ ] Manual "generate now" button for live diagrams
- [ ] Streaming API responses for faster feedback
- [ ] Multiple case studies
- [ ] Save/load reasoning sessions
- [ ] Collaborative reasoning (multi-user)
- [ ] Mobile responsive layout
