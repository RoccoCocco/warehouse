## How to run

```sh
npm i
npm run process
```

## Notes

- Edit `src/data.ts` as needed
- Item pick logic is contained in strategies
- Current implementation leverages two strategies
  - One to split into priority groups
  - One to order groups by most value gain

## Assumptions

1. Item can be only ordered once
2. Items with higher priority gain should added first
3. Item dependencies with lower priority score are added with the parent
