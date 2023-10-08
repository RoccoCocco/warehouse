## How to run

```sh
npm i
npm run process
```

Edit `src/data.ts` as needed.

## Notes

- Item pick logic is contained in strategies
- There are some dummy strategies
- Current implementation leverages two strategies

## Assumptions

1. Item can be only ordered once
2. Items with higher priority gain should added first
3. If items share same priority, optimize value gain
