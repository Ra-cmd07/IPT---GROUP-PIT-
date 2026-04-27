# Kitchen Queue Fixes Complete + Auto-delete Completed Orders

## Completed:
1. [x] App.tsx Router + components
2. [x] api.ts Real RTQ + mock reliable
3. [x] Live create/queue sync
4. [x] Status update buttons

## New Feature Added:
5. [x] Auto-delete completed orders after 10 mins (via completedAt timestamp filter in useOrders)

**Test:** Create order -> advance to completed -> wait 10s (or check timestamp) -> disappears from queue.

Fully functional kitchen system!
