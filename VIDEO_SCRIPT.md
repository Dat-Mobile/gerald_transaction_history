# Video Walkthrough Script

Target length: 3-5 minutes.

## 1. Opening And Architecture Decision

"This is Gerald's Transaction History screen built with React Native CLI and TypeScript. It is not an Expo project; the repo includes native `ios` and `android` directories from the React Native CLI template.

The main architectural decision I made was to keep the feature small and layered: the required domain type lives in `src/types`, realistic mock records live in `src/data`, the async boundary is `src/services/transactionsApi.ts`, and pure business logic like filtering and formatting lives in `src/utils`. The screen imports the service and utilities, but it does not reach into raw mock data. That means a real API could replace the mock source without rewriting the UI."

## 2. Happy Path Demo

"On launch, the screen shows skeleton rows while the mock API Promise resolves. Once loaded, it displays the transaction history. Each row shows merchant, category, date, and amount. Income is green and expenses are red. The mock data includes more than 20 realistic records with positive income amounts and negative expense amounts."

## 3. Filters And Debounced Search

"The segmented filter supports All, Income, and Expenses. The selected state is also exposed to screen readers through accessibility state.

The merchant search is debounced by 300 milliseconds. That keeps the UI from recomputing filtered results on every single keystroke. The actual filtering is a pure utility, so behavior like case-insensitive search and trimmed whitespace is covered in Jest tests."

## 4. Loading, Error, Empty, And Pull-To-Refresh States

"Initial loading is distinct from refresh. The first fetch shows skeleton rows. Pull-to-refresh uses React Native's `RefreshControl`, keeps the current search and filter active, and refetches the same mock API.

The screen has a full error state with a retry button when no data has loaded yet. If data already exists and a later refresh fails, the screen keeps the existing list visible and shows an inline retry. The mock API supports an explicit failure option, and the test suite verifies that a failed request can be followed by a successful retry.

The empty state appears when loading is finished and the current filter or merchant search has no matches."

## 5. Performance Trade-off

"I used `FlatList`, not FlashList. For this assignment, `FlatList` is the right default because it is built into React Native, avoids another dependency, and is enough for hundreds or low thousands of simple rows.

The list still has the important performance basics: stable `keyExtractor`, fixed row height with `getItemLayout`, memoized `TransactionRow`, stable callbacks, and `useMemo` for filtered and formatted list data. If Gerald expected very large histories, I would move filtering and pagination to the API rather than loading every transaction locally."

## 6. One Honest Trade-off

"I did not add React Native Testing Library component tests in this pass because the generated repo only had Jest and react-test-renderer configured. Instead, I focused on high-signal pure tests for formatting, filter/search behavior, data invariants, sort order, and mock API retry recovery. For production, I would add component and integration tests around the screen states and interactions."

## 7. Questions Before Production

"Before shipping this to production, I would ask Gerald a few product and platform questions: what is the pagination contract, what timezone should transaction dates use, whether `amount` sign or `type` is the source of truth, whether multiple currencies are supported, how categories are defined, what analytics are allowed, and what offline or security constraints apply to financial data."
