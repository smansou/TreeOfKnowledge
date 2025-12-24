# Data model (mocks)

Core types live in `src/types`. The knowledge tree is nodes + edges laid out with dagre.

- `Node` — id, title, children
- `Edge` — source, target
- `LearningPath` — ordered node ids

All served from mock data sources for now.
