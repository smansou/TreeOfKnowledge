# Dev log

Informal notes-to-self while building.

## 2025-12-17
Auth is all mocks for now — MSW handlers + fixtures so the UI can be built without a backend. suppressHydrationWarning on the theme wrapper to stop the flash.

## 2026-01-09
Tree component works but expanding a node overflows onto its siblings instead of pushing them away. Need to rerun dagre on expand and animate the reflow.

## 2026-01-21
Thinking about the learning-path generator: take a target node, walk prerequisites, emit an ordered path. Prototype on a branch.

