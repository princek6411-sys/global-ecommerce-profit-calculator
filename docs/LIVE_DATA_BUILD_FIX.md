# Live Data Build Fix

## Vercel failure fixed

The Shopify client failed TypeScript compilation because the paginated GraphQL helper used `any` in its selector and TypeScript could not infer the type of `result` at the order paging call site.

### Fix

- `ShopifyConnection<T>` added for paginated connections.
- `ShopifyOrdersQueryData` added.
- `ShopifyProductRecord` and `ShopifyProductsQueryData` added.
- pagination helper changed from `page<T>` to `page<TData, TNode>`.
- call sites now provide explicit data/node generic parameters and result types.

### Verification

A targeted strict TypeScript compile of the modified client and its direct config dependency passes. A full project build remains `NOT RUN / BLOCKED` in this environment because the ZIP has no lockfile/node_modules and `npm install --ignore-scripts` timed out. No claim of a full build pass is made.
