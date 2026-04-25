# Gerald Transaction History

## 1. Overview

This repository implements a Transaction History screen for Gerald's personal finance app. The screen shows recent income and expense transactions, supports type filtering and merchant search, and handles the core loading, error, empty, and refresh states expected in a finance workflow.

The app is built with React Native CLI and TypeScript. It is not an Expo project. The native `ios/` and `android/` directories are included in the repo, and the runtime dependencies are intentionally limited to `react` and `react-native`.

## 2. Setup

Install JavaScript dependencies:

```sh
npm install
```

Native setup assumptions:

- Node `>=20`, matching `package.json`.
- Xcode and CocoaPods for iOS.
- Android Studio, an Android SDK, and either an emulator or connected device for Android.
- Ruby/Bundler for the generated React Native iOS setup.

Run iOS:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

Run Android:

```sh
npm run android
```

Start Metro directly if needed:

```sh
npm run start
```

## 3. Scripts

Available scripts from `package.json`:

```sh
npm run ios        # react-native run-ios
npm run android    # react-native run-android
npm run start      # react-native start
npm test           # jest
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
```

## 4. Feature Coverage

- Mock async transaction source: `src/services/transactionsApi.ts` returns a delayed Promise so the UI exercises real loading behavior.
- 20+ realistic transactions: `src/data/transactions.ts` contains 25 mixed records across payroll, groceries, dining, subscriptions, utilities, travel, shopping, and reimbursements.
- Transaction list: `src/screens/TransactionHistoryScreen.tsx` renders data with `FlatList`.
- Required fields: each row displays merchant, amount, date, and category.
- Formatting: `src/utils/formatters.ts` formats amounts as USD and dates via `Intl`.
- Income/expense color coding: `TransactionRow` renders income in green and expenses in red.
- Filters: `FilterTabs` supports All, Income, and Expenses.
- Debounced search: `useDebouncedValue` applies merchant search after 300ms instead of filtering on every keystroke.
- Loading state: the first fetch shows skeleton transaction rows.
- Error state with retry: `ErrorState` exposes a full-screen retry action for initial failures, and the loaded screen shows an inline retry if a later refresh fails. The mock API supports explicit failure for tests.
- Empty state: shown only after loading when the current filter/search produces no visible rows.
- Pull-to-refresh: `RefreshControl` refetches while preserving the current search and filter.
- Accessibility labels: search, filter tabs, retry, refresh, list, and transaction rows expose useful labels/roles.

## 5. Architecture Decisions

The domain model lives in `src/types/transaction.ts` because the assignment specifies the exact `Transaction` shape. Keeping it separate makes the mock data, mock API, utilities, and components agree on one contract.

Mock data lives in `src/data/transactions.ts`, while the async boundary lives in `src/services/transactionsApi.ts`. That split is intentional: components do not import raw mock data directly, so replacing the mock source with a real API later would be localized to the service layer.

Filter and search logic live in `src/utils/transactions.ts` because they are pure business rules. That makes them easy to test without rendering React Native components and keeps `TransactionHistoryScreen` focused on state orchestration.

Currency and date formatting live in `src/utils/formatters.ts`. The app hoists `Intl.NumberFormat` and `Intl.DateTimeFormat` instances so they are not recreated for every row render. The screen maps filtered transactions into display-ready rows with formatted strings before passing them to `TransactionRow`.

Local state is enough here because this take-home is one screen with one data source and no cross-screen coordination. Adding Redux, Zustand, React Query, or navigation would add surface area without solving a current problem.

`FlatList` is used because it is the standard React Native virtualized list and is sufficient for the assignment's current data shape. FlashList was not added because it would be an extra dependency to justify. The implementation uses a fixed `TRANSACTION_ROW_HEIGHT` and does provide `getItemLayout`, so React Native can calculate offsets without measuring every rendered row.

Dependency decisions were conservative: no UI library, no animation library, no data-fetching library, and no testing framework migration. The repo uses the React Native CLI template tooling plus focused TypeScript/Jest utilities.

## 6. Performance Considerations

The list path is designed to stay reasonable as the data grows from 25 records to hundreds or low thousands:

- `keyExtractor` uses the stable transaction `id`.
- `TransactionRow` is wrapped in `React.memo`.
- `renderItem` and `keyExtractor` are defined outside the component, so they do not churn on each render.
- Handlers passed to memoized children are wrapped in `useCallback`.
- Filtered/search-derived transactions are calculated with `useMemo`.
- Display rows are also derived with `useMemo`, so formatting only reruns when the filtered data changes.
- `Intl` formatters are module-level singletons for the default app formatting path.
- `getItemLayout` is enabled because rows have a fixed height.
- `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, and `removeClippedSubviews` are configured for predictable list behavior.

For hundreds or thousands of local transactions, this shape is still defensible because filtering is simple string/type matching and rendering is virtualized. For much larger datasets, I would move filtering/search to the server or an indexed local store, add pagination, and avoid fetching the full history at once.

For server pagination or infinite scrolling, I would change the service contract to return `{ items, nextCursor }`, add `onEndReached`, track request state per page, dedupe by transaction id, and define how filters/search interact with backend queries. I would also add explicit stale/error states for page-level failures instead of treating every fetch as a full-screen request.

## 7. Accessibility

The search input has `accessibilityLabel="Search transactions by merchant name"` and the clear action has its own label.

The filter control exposes a tab list, each filter is a tab, and the selected filter uses `accessibilityState={{ selected: true }}`. This makes the All / Income / Expenses state understandable without relying on visual styling.

The full-screen retry action is labeled "Retry loading transactions". A post-load refresh failure also exposes "Retry refreshing transactions". The loading skeleton and transaction list expose labels so screen reader users understand what is happening.

Transaction rows are accessible as a single readable item. The row label includes merchant, category, income/expense type, formatted amount, and formatted date. Color is useful for sighted scanning, but screen readers still hear whether the row is income or expense.

## 8. Tests

Tests live in `src/__tests__`.

`formatters.test.ts` validates:

- USD currency formatting for positive and negative amounts.
- Locale-aware date formatting with an explicit timezone to avoid environment-dependent test failures.

`transactions.test.ts` validates:

- All filter returns all records.
- Income and expense filters return the correct subsets.
- Merchant search is case-insensitive.
- Merchant search trims whitespace.
- Type filtering and search combine correctly.

`transactionsApi.test.ts` validates:

- The mock source has at least 20 transactions.
- Income amounts are positive and expense amounts are negative.
- The mock API returns newest-first results without mutating the source data.
- A failed mock request can be followed by a successful retry.

What remains untested: full React Native component interactions, pull-to-refresh gesture behavior, and screen reader output in a real device environment. I did not add React Native Testing Library because it was not already configured, and pure utility/API tests gave the highest signal with the smallest setup.

## 9. Trade-offs

This was scoped like a 3-4 hour take-home, so I kept the implementation small and defendable.

Intentionally simple:

- One screen, no navigation.
- Local state instead of a global store.
- Mock API instead of real networking.
- `FlatList` instead of FlashList.
- Plain `StyleSheet.create` instead of a UI kit or design system.
- Skeleton rows without complex shimmer animation.
- No Reanimated transition for filters because it is optional and would add dependency/setup cost.

Not implemented:

- Server pagination or infinite scrolling.
- Persisted cache/offline mode.
- Analytics.
- Observability for errors.
- Real authentication or secure financial-data handling.
- Full component/integration test suite.
- Runtime demo control to force the error state. The failure path is supported by the mock API and covered by tests, and the UI includes retry affordances for both initial and post-load failures.

## 10. What I Would Improve With More Time

- Add cursor-based pagination or infinite scrolling once the API contract is known.
- Replace the mock API with a real typed API client and response validation.
- Add error observability with request metadata, retry count, and platform context.
- Add analytics for filter changes, search usage, refresh, retry, and empty results.
- Add offline/cache strategy for recent transactions, including stale-data indicators.
- Improve skeletons with design-system tokens and optional shimmer if the app already uses an animation library.
- Validate accessibility with VoiceOver and TalkBack on devices.
- Add React Native Testing Library component tests for loading, empty, filtering, search, retry, and refresh behavior.
- Define timezone and localization rules for transaction dates before production.
- Integrate Gerald's design system for spacing, typography, colors, and reusable controls.

## 11. Questions Before Production

- What is the API contract for transaction history, including pagination and filtering?
- Should transactions always be sorted newest first, or can users change sort order?
- What timezone should dates use: transaction settlement timezone, user locale, account timezone, or UTC?
- Is the category taxonomy fixed, user-editable, or returned as localized display copy?
- Is `amount` sign or `type` the source of truth if they ever conflict?
- Will Gerald support non-USD accounts or multiple currencies?
- What empty and error copy matches Gerald's product tone and compliance constraints?
- Which analytics events are useful without over-collecting sensitive financial behavior?
- What are the offline expectations for viewing recent transactions?
- Are there security, privacy, retention, or masking constraints for financial transaction data?

## Video Walkthrough

See [VIDEO_SCRIPT.md](./VIDEO_SCRIPT.md) for a 3-5 minute walkthrough script.
