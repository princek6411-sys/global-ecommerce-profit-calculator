============================================================
PROFITPILOT — EXISTING PROJECT SAFE UPGRADE
MASTER-OF-MASTER ENGINEERING + PRODUCT + UX + QA PROMPT
============================================================


============================================================
ROLE
============================================================

Act as a senior staff-level engineer, product architect,
financial-systems engineer, UX/product designer, QA lead,
and production-deployment engineer specializing in:

- Next.js + TypeScript
- React / App Router
- ecommerce financial calculations
- seller analytics
- money/currency systems
- FX architecture
- marketplace economics
- UX/product design
- accessibility
- responsive design
- performance
- SEO
- QA/regression testing
- dependency/build safety
- production deployment

You are modifying an EXISTING production-oriented application.

This is NOT a greenfield build.

Your responsibility is to improve the existing application safely,
preserve working behavior, eliminate calculation and data-integrity
risks, fix verified bugs, and deliver a significantly stronger
user experience without turning the project into an unnecessary rewrite.

The existing repository is the source of truth.

Do not assume that the architecture described in this prompt already
exists in the repository.

Do not fabricate implementation details.

Do not silently change business economics.


============================================================
0. ABSOLUTE PROJECT IDENTITY — NEVER CHANGE
============================================================

EXISTING PROJECT/FOLDER:

ecom-profit-calculator

EXISTING GITHUB REPOSITORY:

global-ecommerce-profit-calculator

EXISTING VERCEL DEPLOYMENT:

https://global-ecommerce-profit-calculator.vercel.app

These are part of the existing technical identity.

DO NOT:

- rename the project
- rename the root folder
- rename the GitHub repository
- create a second project
- create a second application
- create a replacement application
- create a wrapper application
- change the Vercel project identity
- change package identity merely for branding
- move the whole project under another folder

"ProfitPilot" is the PRODUCT / BRAND NAME.

The technical project identity must remain compatible with:

ecom-profit-calculator
global-ecommerce-profit-calculator

If package.json already contains a valid package name:

PRESERVE IT.

Never rename package.json identity merely to make it say
"ProfitPilot".

Never create a new repository, second app, or parallel implementation
merely because the requested upgrade is substantial.


============================================================
1. ABSOLUTE RULE — INSPECT FIRST, IMPLEMENT SECOND
============================================================

DO NOT start coding immediately.

Before modifying application source code or configuration:

1. Identify the actual project root.
2. Confirm package.json location.
3. Confirm app/ location.
4. Confirm components/ location.
5. Confirm lib/ location.
6. Inspect package.json.
7. Inspect lockfile and package manager.
8. Inspect Next.js version.
9. Inspect React version.
10. Inspect TypeScript version.
11. Inspect tsconfig.json.
12. Inspect next.config.*
13. Inspect postcss.config.*
14. Inspect public/.
15. Inspect all app routes.
16. Inspect all components.
17. Inspect all lib modules.
18. Inspect localization.
19. Inspect marketplace configuration.
20. Inspect country configuration.
21. Inspect calculator formulas.
22. Inspect money/currency handling.
23. Inspect FX handling.
24. Inspect result/save/share logic.
25. Inspect comparison logic.
26. Inspect what-if/stress logic.
27. Inspect CSV/SKU processing.
28. Inspect SEO.
29. Inspect sitemap.
30. Inspect robots.
31. Inspect legal pages.
32. Inspect current homepage.
33. Inspect global CSS/design tokens.
34. Inspect existing tests and scripts.
35. Inspect import/dependency relationships.
36. Identify duplicate business logic.
37. Identify client/server boundaries.
38. Identify known build-risk dependencies.
39. Identify existing environment variables.
40. Identify existing API routes and external providers.
41. Identify existing data-trust/status conventions.
42. Identify existing calculation and recommendation configuration.

The ACTUAL repository is the source of truth.

Never assume the architecture described later in this prompt already exists.

If something is missing:

"Not currently implemented."

If something cannot be confidently determined:

"Needs verification."

Do not fabricate findings.

Do not infer that an existing feature works merely because files
with similar names exist.

Before application implementation begins:

- audit the repository
- establish safe change boundaries
- identify the minimum required changes
- identify regression risks
- identify dependencies between changes

Do not modify application source code until the audit has established
which changes are actually necessary.

Audit documentation files are explicitly allowed during the audit phase.


============================================================
2. ROOT STRUCTURE SAFETY
============================================================

The actual project root must directly contain the project.

VALID:

ecom-profit-calculator/
    app/
    components/
    lib/
    public/
    package.json
    tsconfig.json
    ...

INVALID:

ecom-profit-calculator/
    ecom-profit-calculator/
        app/
        components/
        lib/

INVALID:

work_home/
    app/
    components/
    package.json

INVALID:

some-new-folder/
    ecom-profit-calculator/
        ...

Do not create wrapper directories.

Do not move the entire project into another directory.

Do not create a second root containing the existing project.

Before completion inspect the final tree.

The final repository root must remain structurally compatible with
the original project.

No nested project.

No wrapper project.

No replacement project.


============================================================
3. AUDIT BEFORE IMPLEMENTATION
============================================================

Create or update ONLY the audit documentation during the audit stage:

docs/ARCHITECTURE_AUDIT.md

The audit must describe the REAL current implementation.

Include:

A. project structure
B. dependency map
C. package manager
D. lockfile state
E. client/server boundaries
F. homepage architecture
G. calculator architecture
H. calculation entry points
I. duplicate formulas
J. money/currency handling
K. FX handling
L. marketplace configuration
M. country configuration
N. localization
O. comparison logic
P. what-if/stress logic
Q. CSV/SKU architecture
R. save/share/persistence
S. SEO
T. tests
U. scripts
V. environment configuration
W. current risks
X. recommended safe refactor boundaries

Do not create speculative architecture diagrams.

The audit is evidence, not aspiration.

Do not document an architecture merely because it would be desirable.

Do not document planned features as implemented features.


============================================================
4. CHANGE MINIMIZATION
============================================================

Prefer the smallest safe change that satisfies the requirement.

Before modifying a file ask:

"Is this file change necessary for the requested upgrade?"

If not necessary:

LEAVE IT UNCHANGED.

Do not:

- refactor unrelated code
- perform speculative cleanup
- rename working files without need
- rewrite architecture merely because a different architecture is possible
- replace stable components unnecessarily
- replace working libraries merely for preference

The objective is:

EXISTING WORKING SYSTEM
+
TARGETED IMPROVEMENTS
+
REGRESSION SAFETY

Every change must have a technical or product reason.

Every architectural migration must have a documented reason.

Every business-logic change must have regression evidence.


============================================================
5. PRESERVE ALL EXISTING WORKING FEATURES
============================================================

Treat the existing application as the baseline.

Preserve working:

- calculator
- true profit
- margin
- ROI
- profit score
- verdict
- break-even
- target-profit price
- target-margin price
- maximum ad spend
- what-if
- stress testing
- comparison
- country selector
- currency selector
- language selector
- marketplace selector
- save
- share
- CSV
- SKU analysis
- SEO routes
- legal pages
- roadmap
- navigation
- responsive behavior

If a feature works:

PRESERVE ITS PUBLIC BEHAVIOR.

If refactoring is required:

preserve behavior unless a documented bug fix requires change.

Never delete functionality merely to simplify the implementation.

Never remove a feature just to reduce code complexity unless the user
explicitly requested its removal.


============================================================
6. DO NOT REBUILD FROM SCRATCH
============================================================

Do not:

- rewrite the entire application
- replace app/page.tsx unnecessarily
- replace the entire CSS system
- create a second calculator
- create duplicate versions of components
- copy business formulas into UI components
- create "v2" architecture beside the existing architecture

Never create files such as:

money2.ts
calculator-new.ts
homepage-final.tsx
homepage-v2.tsx
calculator-fixed.tsx

If an equivalent module already exists:

EXTEND OR REFACTOR IT.

One existing capability should have one maintainable implementation.

Do not create a new subsystem merely to avoid understanding the
existing subsystem.


============================================================
7. KNOWN CURRENCY BUG — MUST FIX
============================================================

Known bug:

Changing currency currently changes only the symbol and does not
convert the underlying monetary value.

Example:

Correct source:

$11.04 USD

Incorrect:

₹11.04

Correct:

₹[11.04 × USD/INR FX rate]

The numerical amount MUST change.

Do not solve this by replacing symbols.

Fix the underlying money + FX architecture.

The acceptance test must prove that changing currency changes the
numerical monetary value whenever the source and destination currencies
differ.

A currency-code change without a numerical conversion is a FAILURE.


============================================================
8. EXACT SUPPORTED CURRENCIES
============================================================

Support EXACTLY:

USD — US Dollar
EUR — Euro
INR — Indian Rupee
JPY — Japanese Yen
GBP — British Pound
CAD — Canadian Dollar
AUD — Australian Dollar
AED — UAE Dirham
SAR — Saudi Riyal

Do not add other currencies unless explicitly requested.

Do not remove these currencies.

Create or safely preserve ONE centralized currency registry.

Registry should support:

- ISO code
- symbol
- display name
- locale
- decimal policy
- active/inactive status

Do not create currency-specific conversion systems.


============================================================
9. OPERATING CURRENCY VS DISPLAY CURRENCY
============================================================

Separate:

OPERATING CURRENCY

from:

DISPLAY / REPORTING CURRENCY

Example:

Marketplace:
Amazon US

Operating:
USD

Display:
INR

The economics are calculated in the operating currency.

Only monetary presentation is converted to the display currency.

Changing display currency MUST NOT change the underlying economics.

UI must clearly communicate:

Operating currency
Display currency
FX reference rate

Never imply display currency changes marketplace-native currency.


============================================================
10. MONEY MODEL
============================================================

Inspect the existing money implementation first.

If lib/money.ts already exists:

extend/refactor safely.

If an equivalent money module exists:

reuse it.

Conceptual model:

Money {
    amount: number
    currency: CurrencyCode
}

Money values must carry their currency.

Centralize where practical:

- finite-number validation
- arithmetic
- formatting
- rounding
- conversion
- currency registry access

Do not scatter:

amount + arbitrary currency symbol

throughout React components.

Money calculations must remain explicit enough that currency confusion
cannot silently occur.

Avoid hidden implicit currency assumptions.


============================================================
11. FX ARCHITECTURE
============================================================

Inspect the EXISTING FX implementation FIRST.

If an existing lib/fx.ts or equivalent FX module already provides
the required behavior:

extend/refactor it safely.

Do NOT create lib/fx/ merely to satisfy this prompt.

Preserve current architecture unless migration provides a clear
technical benefit.

If migration is truly required:

1. document why
2. migrate safely
3. preserve behavior
4. verify new implementation
5. remove old implementation only after verification

Do not create duplicate FX systems.

Use a replaceable provider abstraction where appropriate:

FXProvider

getLatestRate(baseCurrency, quoteCurrency)

Expected result shape may include:

{
    baseCurrency,
    quoteCurrency,
    rate,
    asOf,
    source,
    freshness
}

Never hard-code a value and claim it is live.

Never silently use stale FX.

A cached FX rate and a stale FX rate are not automatically equivalent.

If cached data is outside the accepted freshness window:

label it explicitly as:

STALE

Never present stale FX as current/live FX.

If stale FX is allowed as a fallback by the existing product behavior,
the UI/result metadata must explicitly communicate that the conversion
uses a stale fallback rate.


============================================================
12. FX PROVIDER / CACHE / FALLBACK
============================================================

Use the existing FX provider if appropriate.

If adding/replacing the provider, use a reputable source and keep
the provider replaceable.

Support where architecture allows:

- latest rate
- source
- timestamp
- freshness
- cache
- fallback
- error state

Define or preserve a clear freshness policy where possible.

If live provider fails:

use cached rate ONLY if a valid cached rate exists.

Clearly communicate:

"Using cached FX rate"

or equivalent.

If cached data is outside the accepted freshness window:

also communicate:

"Using stale FX rate"

or an equivalent clear label.

If no valid FX rate exists:

"FX rate unavailable"

Do not show a fake converted amount.

Do not expose secret provider credentials in client code.

Do not put private secrets into NEXT_PUBLIC_*.

Prefer server-side access where required.

If external credentials are unavailable:

do not invent credentials.

Implement the safe interface/configuration boundary and document
what is missing.

Never make a stale or cached value appear to be a live provider result.


============================================================
13. FX DISPLAY TRUST
============================================================

When operating and display currencies differ, expose enough context
for the result to be understandable.

Example:

Operating: USD
Display: INR
Reference: 1 USD = ₹XX.XX
Updated: DATE/TIME
Source: PROVIDER

Also state, where appropriate:

"FX reference rate. Actual marketplace/payment settlement rates may differ."

Never claim the calculator FX rate is the exact marketplace settlement
rate unless verified.

The UI must distinguish, where applicable:

LIVE
CACHED
STALE
UNAVAILABLE

Do not hide FX uncertainty behind polished presentation.


============================================================
14. HISTORICAL FX
============================================================

Do not rewrite historical profitability using today's FX.

Distinguish:

1. latest/display FX
2. transaction-date FX
3. settlement-date FX

Current calculator may use latest FX.

Historical CSV/SKU analysis should preserve original transaction currency.

If transaction/settlement FX exists:

use it.

If unavailable:

label conversion:

Estimated

or:

Unavailable

Do not silently rewrite historical economics.

Historical records must retain source-currency context whenever available.


============================================================
15. SINGLE CALCULATION ENGINE
============================================================

Inspect existing calculation logic first.

Identify:

- all profit formulas
- all fee calculations
- all pricing formulas
- all scenario formulas
- all comparison formulas
- all homepage formulas
- all CSV/SKU formulas

Create or safely refactor toward ONE calculation source of truth.

If an equivalent engine already exists:

reuse/refactor it.

Do not duplicate calculations.

The central calculation logic should power, where applicable:

- full calculator
- homepage calculator
- result calculations
- comparisons
- what-if
- stress tests
- country comparison
- marketplace comparison
- save/share
- CSV/SKU analysis

If formulas change:

document:

OLD BEHAVIOR
NEW BEHAVIOR
WHY CHANGED
REGRESSION IMPACT

Never silently change business economics.


============================================================
15A. CALCULATION CHANGE-IMPACT GATE
============================================================

Before changing any existing business formula:

1. identify the current formula
2. identify every caller
3. identify every UI/result depending on it
4. identify existing tests
5. document the intended behavior change
6. add/update regression tests
7. verify representative old-vs-new outputs

Do not change a financial formula merely because a different
implementation appears cleaner.

A cleaner implementation is NOT by itself sufficient justification
for changing business results.

Any change that affects:

- profit
- margin
- ROI
- fees
- taxes
- shipping
- returns/RTO
- break-even
- target price
- ad spend limits
- marketplace ranking

must be treated as a business-logic change and regression-tested
before completion.

When old behavior is intentionally corrected:

preserve the old result in regression documentation where useful,
document why the old result was wrong, and verify that all dependent
features now use the corrected behavior consistently.


============================================================
16. HOMEPAGE/FULL-CALCULATOR CONSISTENCY
============================================================

MANDATORY.

The homepage mini calculator and full calculator MUST use:

- the same calculation engine
- the same business definitions
- the same fee semantics
- the same profit definitions
- the same operating/display currency rules

Do NOT maintain homepage-only profit formulas.

A result shown in the homepage demo must be reproducible by the full
calculator using equivalent inputs and assumptions.


============================================================
17. MONEY/CALCULATION INVARIANTS
============================================================

Changing DISPLAY currency must NOT change:

- percentage fees
- fixed fees
- shipping assumptions
- product-cost economics
- tax assumptions
- return rate
- RTO rate
- ad rate
- margin
- ROI
- profit score
- verdict

Only monetary presentation changes.

Example:

USD:
Profit = $11.04
Margin = 22.09%

INR:
Profit = converted INR amount
Margin ≈ 22.09%

This is mandatory.

Operating-currency economics must remain unchanged internally.


============================================================
18. PROFIT LAYERS
============================================================

Preserve existing semantics.

Support only where compatible:

Gross Profit
Contribution Profit
Ad-adjusted Profit
True Profit

Document exactly what each layer includes.

Avoid double counting.

If a cost is already included:

do not subtract it again.

Every profit layer must have an auditable definition.


============================================================
19. PRICING / BREAK-EVEN FORMULAS
============================================================

Audit current formulas before changing them.

Ensure, where implemented:

- break-even price
- target-profit price
- target-margin price
- maximum ad spend

remain consistent with the central calculation engine.

Handle impossible cases explicitly.

Never emit:

NaN
Infinity


============================================================
20. MARKETPLACE CONFIGURATION
============================================================

The configured marketplace set is EXACTLY:

Amazon
Flipkart
Meesho
TikTok Shop
Shopify
Etsy
eBay
Walmart

Inspect existing configuration first.

Centralize marketplace configuration where practical.

Support metadata such as:

- marketplace
- supported countries
- operating currency
- fee model
- shipping model
- return model
- supported inputs
- feature capabilities
- data source/status

Do not scatter marketplace formulas across UI components.

Do not add "Own Store" to this marketplace registry unless the actual
existing application already models it explicitly as a marketplace.


============================================================
21. MARKETPLACE DATA TRUST
============================================================

Never invent current:

- marketplace fees
- payment fees
- shipping charges
- tax rates
- returns
- RTO
- platform policies

Existing assumptions must remain clearly labeled:

Example
Estimated
User-defined
Unavailable
Stale
Verified

Support metadata where practical:

status
source
sourceUrl
effectiveDate
lastVerified
notes

Never call an example fee "verified."

Never call an estimated value "current."

If authoritative data cannot be verified:

label it appropriately.

Do not create false precision by displaying an unsupported value
with excessive decimal precision or a "verified" label.


============================================================
22. COUNTRY SUPPORT
============================================================

Preserve:

India
USA
Germany
France
Spain
Japan

Do not invent country-specific economics.

If information is unavailable:

Data unavailable

or:

User input required.

Never silently fill missing data.


============================================================
23. HOMEPAGE — PRIMARY PRODUCT OBJECTIVE
============================================================

The PRIMARY user-visible objective is:

UPGRADE THE EXISTING HOMEPAGE.

Do not spend the majority of the implementation on unrelated backend refactoring.

Modify core architecture ONLY where necessary to:

- fix currency conversion
- ensure homepage/full-calculator consistency
- support explainable recommendations
- eliminate duplicated formulas
- preserve existing functionality

The homepage must receive a meaningful visible upgrade.

The result should feel like an evolution of the existing product,
not a replacement application.


============================================================
24. HOMEPAGE 10-SECOND TEST
============================================================

On a fresh visit, a first-time visitor should understand within
approximately 10 seconds:

1. this is an ecommerce profit calculator
2. it calculates TRUE PROFIT, not just revenue
3. I can enter product numbers immediately
4. the result tells me whether the economics are healthy
5. I can see WHY
6. I can see WHAT TO TEST NEXT
7. I can continue to the full calculator

Do not depend on long paragraphs for comprehension.


============================================================
25. HERO
============================================================

Headline:

"Will your product actually make money?"

Keep existing strong brand direction where possible.

Hero must contain a live mini-calculator.

Primary inputs:

- selling price
- product cost
- ad spend
- shipping

Optional advanced inputs may remain progressively disclosed.

Hero result hierarchy:

TRUE PROFIT
MARGIN
VERDICT

Then, where applicable:

Largest Profit Leak
Next Best Test

The result must be visually dominant.

Do not overload the first screen.

Primary flow:

HOOK
→ INPUT
→ TRUE PROFIT
→ WHY
→ NEXT MOVE
→ ADVANCED TOOLS


============================================================
26. VISUAL PRESERVATION RULE
============================================================

Before changing homepage UI, inspect:

- typography
- spacing
- colors
- navigation
- buttons
- cards
- borders
- shadows
- existing components
- responsive behavior
- brand personality

Preserve strong existing design.

Do NOT replace the homepage with:

- generic SaaS template
- dashboard UI
- feature-grid landing page
- icon showcase
- excessive gradients
- fake AI aesthetic
- decorative chart collection

Every visual element must improve:

UNDERSTANDING

or

NAVIGATION

or

DECISION-MAKING

or

TRUST.

Clarity > consistency > brand recognition > decoration.


============================================================
27. TRUST LAYER
============================================================

Immediately after hero:

"Every important number has context."

Show concise trust information where supported:

- fee status
- FX status
- calculation source
- assumption status
- privacy/data handling

No fake:

- users
- customers
- ratings
- reviews
- revenue
- testimonials
- usage counters


============================================================
28. REVENUE IS NOT PROFIT
============================================================

Create a clear, understandable explanation:

Revenue
↓
Product Cost
↓
Marketplace / Payment Fees
↓
Shipping
↓
Advertising
↓
Returns / RTO
↓
Tax / Applicable Other Costs
↓
TRUE PROFIT

Do not use decorative charts merely for appearance.

The visual should explain the economics.


============================================================
29. DECISION ENGINE
============================================================

Primary actions:

CALCULATE
COMPARE
STRESS-TEST

Each should answer a clear user question.

CALCULATE:

"Is this product profitable?"

COMPARE:

"Where does the same product economics look stronger?"

STRESS-TEST:

"What happens when costs/pricing worsen?"

Avoid feature dumping.


============================================================
30. PROFIT LEAK DETECTOR
============================================================

Determine the largest actual cost category from the current calculation.

Possible categories:

Product Cost
Marketplace Fees
Payment
Shipping
Advertising
Returns/RTO
Tax
Other

Rank by actual monetary impact.

Do not hard-code "Ads" or any other category.


============================================================
31. RECOMMENDATION ENGINE
============================================================

The homepage must provide useful, explainable next-step recommendations
based on the user's actual calculated economics.

Recommendations MUST be:

- deterministic
- reproducible
- explainable
- based on actual inputs/results
- conservative
- non-guaranteed

Possible triggers:

highest cost driver
→ review that cost

low margin
→ test higher selling price

high advertising burden
→ test lower ad spend

high shipping burden
→ test lower shipping cost

high product cost
→ test lower COGS

marketplace comparison
→ test marketplace with stronger local economics

Recommendations must distinguish between:

- controllable costs
- partially controllable costs
- externally determined costs

Do not recommend reducing a cost that the seller cannot realistically
control.

If the largest cost is not practically controllable, recommend the
highest-impact controllable economic lever instead.

Every recommendation MUST include:

1. WHAT should be tested
2. WHY it was recommended
3. WHICH actual metric triggered it

Do not fabricate AI reasoning.

Do not call deterministic rules "AI."

Do not claim certainty.

Do not claim guaranteed improvement.

IMPORTANT:

Do not hard-code arbitrary thresholds inside UI components.

If thresholds are required:

- centralize them
- document them
- make them testable
- use existing decision-engine configuration where available

Example:

A recommendation should be traceable to the calculation:

"Advertising is currently the largest controllable cost at ₹X,
representing Y% of selling price."

Then:

"Next test: reduce ad spend by ₹Z and recalculate."

A recommendation must never reference data that is unavailable,
unverified, or not part of the current calculation.


============================================================
32. PROFIT RANGE / SURVIVAL
============================================================

Use scenario-based calculations powered by the central engine.

Possible scenarios:

Base
Downside
Price -10%
COGS +10%
Ads +20%
Shipping +10%
Returns +10%
Worst case

Every scenario must call the same calculation engine.

Never implement separate scenario formulas.

Label clearly:

"Scenario-based illustration"

Do not call this:

forecast
guarantee
prediction

unless actual forecasting logic is implemented.


============================================================
33. MARKETPLACE / SELLING-CHANNEL COMPARISON
============================================================

Where supported, compare the existing configured marketplaces:

Amazon
Flipkart
Meesho
TikTok Shop
Shopify
Etsy
eBay
Walmart

An "Own Store" scenario may also be compared ONLY WHERE THE EXISTING
APPLICATION ALREADY SUPPORTS IT.

IMPORTANT:

"Own Store" is a selling-channel/business-model scenario,
not an additional marketplace registry entry unless the existing
application explicitly models it as a marketplace.

Do not add Own Store to the marketplace registry merely because
this comparison section mentions it.

Do not invent Own Store fees, payment costs, shipping costs,
returns, taxes, or other economics.

Do not compare unsupported channels.

Do not claim:

"Best marketplace"

unless supported by actual available data.

Prefer:

"Best estimate under current assumptions."

Compare:

- native/local profit
- native/local margin
- converted reporting profit
- fee burden
- shipping burden
- return burden
- ad burden
- confidence
- data freshness

Ranking priority:

1. local margin
2. local contribution profit
3. converted reporting profit

CRITICAL MARKETPLACE ECONOMICS RULE:

Do not compare marketplaces using converted absolute profit alone
when operating currencies differ.

Preserve and display the native operating-currency economics first.

Converted values are for reporting and user comparison only.

FX conversion must never become the primary reason a marketplace
appears economically superior when the underlying local economics
do not support that conclusion.

If two marketplace scenarios are materially similar economically,
prefer the scenario with stronger data confidence and freshness.

Never allow weak or stale marketplace data to create false precision.

Do not use data freshness as an excuse to hide a meaningful difference,
but do communicate when confidence is limited.


============================================================
34. GLOBAL COUNTRY SECTION
============================================================

Show:

India
USA
Germany
France
Spain
Japan

Country UI must communicate:

- country
- marketplace context
- operating currency
- display currency

Flags are optional, but never use them merely as decoration.


============================================================
35. SELLER INTELLIGENCE
============================================================

Keep advanced seller intelligence below the core calculator journey.

Positioning:

"Already selling?
Find out where your money actually went."

Where supported by the existing architecture:

CSV
→ validation
→ normalized transactions
→ currency-aware calculations
→ SKU analytics

Support where evidence exists:

- SKU profitability
- returns/RTO
- deduction audit
- settlement reconciliation
- loss-making SKU detection

Never invent deduction explanations.

When evidence is insufficient:

"Unclassified difference"


============================================================
36. CSV / HISTORICAL DATA SAFETY
============================================================

Preserve source currency.

Do not silently convert historical transaction economics with today's FX.

Validate:

- headers
- row shape
- numeric values
- currencies
- dates
- missing values
- duplicate rows where relevant

If source currency does not match expected currency:

do not silently reinterpret it.

Report the mismatch clearly.

Never silently overwrite historical source values.


============================================================
37. LOCAL PRIVACY
============================================================

If CSV processing occurs in the browser:

say so clearly.

Do not upload seller financial data unless explicitly required
by the existing architecture.

Do not introduce server-side storage unnecessarily.

Do not add tracking that is not required.


============================================================
38. ACCESSIBILITY
============================================================

Target WCAG 2.2 AA-level practices where applicable.

Preserve/improve:

- semantic HTML
- labels
- accessible names
- keyboard operability
- visible focus
- no keyboard traps
- screen-reader clarity
- adequate touch targets
- appropriate heading hierarchy
- accessible error states
- accessible status/result updates
- meaningful link/button text

Do not replace semantic controls with inaccessible custom UI.

Selectors must be keyboard usable.

If a custom listbox is not necessary:

prefer native controls.


============================================================
39. RESPONSIVE
============================================================

Verify at minimum:

320px
360px
390px
430px
768px
1024px
1280px
1440px

Check:

- no horizontal overflow
- no clipping
- no broken cards
- no broken tables
- calculator remains usable
- inputs remain usable
- result remains readable
- CTAs remain obvious
- selectors remain usable


============================================================
40. PERFORMANCE / NEXT.JS
============================================================

Do not make the entire homepage a Client Component unnecessarily.

Preserve Server Components where possible.

Keep interactive logic isolated to focused client components.

Do not request FX on every keystroke.

Cache or memoize appropriately.

Lazy-load heavy analytics/CSV functionality where safe.

Use existing Next.js built-in optimization mechanisms where applicable.

Do not add unnecessary dependencies.

Do not introduce layout-shifting UI.

Review:

- JavaScript weight
- hydration scope
- image usage
- font loading
- Core Web Vitals risks
- unnecessary client-side fetching

Where assets are introduced, use the existing Next.js image/font
optimization architecture when appropriate.


============================================================
41. SEO
============================================================

Preserve all working SEO architecture.

Do not delete:

- metadata
- sitemap
- robots
- canonical configuration
- SEO routes
- structured data where already present
- meaningful headings

Do not hide core SEO content entirely behind client-only rendering.

Do not create thin SEO pages.

Do not alter URLs unless absolutely required and verified safe.


============================================================
42. ERROR SAFETY
============================================================

Never render:

NaN
Infinity
undefined
null
[object Object]

Validate:

- empty values
- zero
- negative
- decimal
- large numbers
- malformed input
- impossible formulas

Gracefully handle:

- missing marketplace configuration
- missing FX
- FX timeout
- FX provider failure
- stale FX
- invalid CSV
- malformed data
- unavailable fee data

Never invent a numeric fallback.

Every user-visible financial result must be finite and explainable.


============================================================
43. ROUNDING
============================================================

Do not round intermediate calculations unnecessarily.

Round mainly for display.

Respect currency-specific decimal policy.

Example:

JPY normally uses no unnecessary decimal display.

Document rounding behavior.

Rounding must not alter the underlying calculation engine's economics.


============================================================
44. SECURITY / DATA INTEGRITY
============================================================

Do not:

- expose secrets
- use unsafe dynamic execution
- execute uploaded content
- trust external FX responses without validation
- trust CSV values without validation
- add unnecessary third-party scripts
- silently mutate user financial data

Validate external data before it reaches business calculations.

Financial data must not be silently transformed or discarded.


============================================================
45. DEPENDENCY / BUILD SAFETY
============================================================

Before adding any dependency:

1. inspect package.json
2. inspect existing equivalent dependencies
3. use a compatible version
4. verify package exports
5. verify Next.js compatibility

Do not import APIs that the installed package does not export.

KNOWN BUILD-SAFETY RULE:

Do not reintroduce previously problematic simple-icons imports
or unsupported marketplace icon exports.

Prefer the existing build-safe BrandIcon/Lucide-based implementation
or existing approved assets.

Do not introduce Tailwind/PostCSS merely for convenience.

Preserve the current build-safe PostCSS architecture unless the
existing project demonstrably requires a change.

If dependencies change:

use the existing package manager and lockfile.

Do not regenerate dependency resolution unnecessarily.

Do not switch package managers.

Do not create a new lockfile merely to resolve a problem.

Do not delete or replace the existing lockfile unless technically
necessary and explicitly documented.

Do not add a dependency when the required capability can safely be
provided by an existing dependency or the platform itself.


============================================================
46. TEST STRATEGY
============================================================

Inspect the existing test framework first.

Do not disable:

- TypeScript
- linting
- existing tests

Do not suppress errors simply to make the build green.

Tests must cover, where the feature exists:

A. basic profit
B. zero values
C. decimals
D. large values
E. invalid negatives
F. discounts
G. high ads
H. high returns
I. RTO
J. tax
K. percentage fee
L. fixed fee
M. fixed + percentage fee
N. break-even
O. target profit
P. target margin
Q. max ad spend
R. price sensitivity
S. stress tests
T. marketplace comparison
U. country comparison
V. currency conversion
W. reverse conversion
X. FX failure
Y. cached FX fallback
Z. stale FX
AA. margin invariance
AB. no NaN
AC. no Infinity
AD. no double counting
AE. malformed CSV
AF. currency mismatch
AG. SKU grouping
AH. settlement reconciliation
AI. homepage/full-calculator consistency
AJ. recommendation determinism
AK. recommendation trigger correctness
AL. recommendation explains its triggering metric
AM. identical inputs produce identical recommendation
AN. changing the triggering metric can change recommendation appropriately
AO. recommendation never references unavailable data
AP. recommendation never claims guaranteed improvement

Recommendation acceptance requires that the recommendation engine:

- produce deterministic output for identical inputs
- clearly expose the metric/fact that triggered the recommendation
- never depend on random behavior
- never depend on hidden unavailable data
- never promise an outcome
- appropriately change recommendation when the relevant economic
  driver changes
- remain reproducible across repeated runs with the same inputs

Where recommendation thresholds exist:

- test boundary conditions
- test values just below the threshold
- test values at the threshold
- test values just above the threshold

Do not test only the obvious happy path.


============================================================
47. MANDATORY CURRENCY ACCEPTANCE
============================================================

Test:

USD → INR
USD → EUR
USD → JPY
INR → USD
EUR → USD

For every test verify:

1. currency code changes
2. numerical amount changes when currencies differ
3. amount is finite
4. no NaN
5. no Infinity
6. FX metadata exists when conversion succeeds
7. margin remains invariant
8. ROI remains invariant where applicable
9. operating-currency economics remain unchanged

Example:

USD profit = 11.04

USD/INR = R

INR profit must equal:

11.04 × R

NOT:

11.04


============================================================
48. NINE-CURRENCY MATRIX
============================================================

Test all supported currencies:

USD
EUR
INR
JPY
GBP
CAD
AUD
AED
SAR

Test representative conversions and reverse conversions.

Do not hard-code fake rates merely to make tests pass.

If external FX is unavailable:

use deterministic fixtures/mocks for provider-interface tests.

Clearly distinguish:

MOCKED PROVIDER TEST

from:

LIVE PROVIDER VERIFICATION

Tests must verify:

- source currency
- destination currency
- numerical conversion
- finite result
- metadata
- invariance of percentage-based economics

Do not mistake a mocked provider result for live FX verification.


============================================================
49. REGRESSION CHECKLIST
============================================================

Create:

docs/REGRESSION_CHECKLIST.md

Cover:

Homepage
Calculator
Results
Compare
What-if
Stress
Country selector
Currency selector
Language selector
Marketplace selector
Save
Share
CSV
SKU
SEO
Legal
Navigation
Mobile

Also include:

- project identity
- package identity
- package manager
- lockfile integrity
- dependency/import integrity
- FX failure/fallback behavior
- currency numerical conversion
- homepage/full-calculator consistency
- recommendation determinism
- recommendation trigger explanation
- native marketplace economics
- data trust labels


============================================================
50. DOCUMENTATION
============================================================

Create/update only what is actually implemented:

docs/ARCHITECTURE_AUDIT.md
docs/MONEY_MODEL.md
docs/FX_ARCHITECTURE.md
docs/CALCULATION_ENGINE.md
docs/MARKETPLACE_DATA_MODEL.md
docs/PROFIT_LAYERS.md
docs/QA_MATRIX.md
docs/REGRESSION_CHECKLIST.md
docs/DATA_TRUST_POLICY.md

Documentation must match actual implementation.

Never document planned features as completed features.

If a requirement cannot be implemented because information,
credentials, or authoritative data is unavailable:

document it as:

BLOCKED

or

NOT IMPLEMENTED

rather than disguising it as complete.


============================================================
51. IMPLEMENTATION ORDER
============================================================

Follow this order, but do not skip any phase that is required by
the acceptance criteria.

A phase may be skipped ONLY when the audit proves that:

1. the requirement is already correctly implemented,
2. no regression-risk change is needed,
3. and the relevant acceptance criterion can be verified without
   modifying that phase.

The audit must record the evidence supporting any skipped phase and
identify the acceptance criteria that were verified without requiring
implementation changes.

Do not skip testing or verification merely because the homepage
appears visually complete.

A phase may NOT be skipped merely because:

- existing code looks clean
- the homepage looks polished
- the feature appears to work manually
- a similar feature already exists elsewhere

The audit must provide evidence for the skip decision.


------------------------------------------------------------
PHASE 0
AUDIT ONLY
------------------------------------------------------------

Inspect the repository before making implementation changes.

Creating or updating ONLY:

docs/ARCHITECTURE_AUDIT.md

is explicitly allowed during this phase because it is the audit artifact.

Do not modify application source code, configuration,
dependencies, business logic, UI behavior, routes, or styling
during PHASE 0.

The audit must establish the actual architecture and safe
implementation boundaries before application changes begin.


------------------------------------------------------------
PHASE 1
HOMEPAGE ARCHITECTURE + VISUAL AUDIT
------------------------------------------------------------

No application implementation yet.

Evaluate the existing homepage against:

- product clarity
- 10-second comprehension
- calculator discoverability
- information hierarchy
- user journey
- trust
- simplicity
- decision-making clarity
- responsive behavior
- existing brand personality

Do not implement the visual redesign during the audit step.

First determine what should change.


------------------------------------------------------------
PHASE 2
MONEY / CURRENCY CHANGES
------------------------------------------------------------

Implement only the money/currency changes required for:

- the homepage
- the existing calculator
- existing dependent features

Verify:

- numerical conversion
- operating/display separation
- invariants
- formatting
- currency registry consistency


------------------------------------------------------------
PHASE 3
FX CHANGES
------------------------------------------------------------

Implement only the FX changes required for trustworthy conversion.

Verify:

- provider
- source
- freshness
- cache
- fallback
- failure behavior
- stale behavior
- metadata
- safe server/client boundaries


------------------------------------------------------------
PHASE 4
CALCULATION ENGINE CONSISTENCY
------------------------------------------------------------

Eliminate duplicate core calculations where required.

Verify:

- homepage
- calculator
- pricing formulas
- scenarios
- comparison
- CSV/SKU
- save/share

all remain consistent with the calculation source of truth.


------------------------------------------------------------
PHASE 5
PROFIT LEAK + DECISION ENGINE + RECOMMENDATIONS + SCENARIOS
------------------------------------------------------------

Implement or safely improve:

- data-derived profit leak
- deterministic recommendations
- controllability-aware recommendations
- explainable recommendation triggers
- scenario calculations
- consistent recommendation outputs

Do not claim AI unless actual AI functionality exists.


------------------------------------------------------------
PHASE 6
MARKETPLACE / COUNTRY COMPARISON
------------------------------------------------------------

Implement only where existing architecture and trustworthy data support it.

Preserve:

- native economics
- local margin
- local contribution profit
- converted reporting values
- confidence
- freshness


------------------------------------------------------------
PHASE 7
CSV / SKU
------------------------------------------------------------

Change CSV/SKU functionality only where existing architecture requires
changes for:

- currency correctness
- calculation consistency
- data integrity
- recommendation correctness
- historical FX semantics

Do not redesign unrelated seller analytics.


------------------------------------------------------------
PHASE 8
HOMEPAGE UX / ACCESSIBILITY / RESPONSIVE
------------------------------------------------------------

Implement the homepage upgrade.

Maintain:

- existing brand strengths
- calculator discoverability
- result prominence
- simplicity
- trust
- keyboard usability
- responsive behavior

Do not turn the homepage into a feature catalogue.


------------------------------------------------------------
PHASE 9
SEO / PERFORMANCE / SECURITY REVIEW
------------------------------------------------------------

Review and preserve:

- SEO
- metadata
- sitemap
- robots
- canonical behavior
- performance
- hydration scope
- client/server boundaries
- security
- privacy


------------------------------------------------------------
PHASE 10
AUTOMATED TESTS + REGRESSION
------------------------------------------------------------

Run:

- existing tests
- new tests
- currency tests
- FX tests
- recommendation tests
- homepage/full-calculator consistency tests
- regression tests

Do not disable or weaken existing tests.


------------------------------------------------------------
PHASE 11
PRODUCTION VERIFICATION
------------------------------------------------------------

Verify:

- final tree
- diff
- imports
- exports
- package identity
- package manager
- lockfile
- typecheck
- lint
- tests
- build
- production-relevant configuration

Only report verified success.


------------------------------------------------------------
AFTER EVERY MAJOR PHASE
------------------------------------------------------------

1. inspect diff
2. run relevant tests
3. typecheck where applicable
4. inspect changed files
5. check for regressions
6. verify acceptance criteria affected by the phase
7. continue only when safe

Do not blindly implement every phase.


============================================================
VISUAL QA / HOMEPAGE REVIEW
============================================================

After homepage implementation, review it as a first-time visitor.

Evaluate:

- visual hierarchy
- headline clarity
- calculator discoverability
- result prominence
- whitespace balance
- section transitions
- readability
- CTA clarity
- trust visibility
- mobile hierarchy
- information density
- consistency with existing brand
- first-interaction clarity

Ask:

"Can a new visitor understand the product without studying the page?"

Do not add UI elements merely because they look impressive.

Every section must justify its existence.

If a section does not improve:

- understanding
- trust
- decision-making
- navigation

simplify or remove it.

Do not use:

- decorative charts
- meaningless badges
- excessive icons
- fake social proof
- unnecessary animations
- visual noise

Visual polish must serve product clarity.


============================================================
PRODUCT SIMPLICITY RULE
============================================================

The homepage is a decision journey, not a feature catalogue.

Do not attempt to show every existing feature above the fold.

Progressive disclosure is preferred.

The visitor should first experience:

INPUT
→ RESULT
→ WHY
→ NEXT TEST

Only then reveal:

COMPARE
→ STRESS-TEST
→ SELLER INTELLIGENCE
→ ADVANCED ANALYTICS

The homepage should feel simpler after the upgrade,
not more complicated.

Every additional section must earn its place.

Prefer fewer stronger decisions over many weaker choices.


============================================================
52. FINAL PROJECT INSPECTION
============================================================

After implementation inspect:

- git diff
- final project tree
- package.json
- lockfile
- changed imports
- changed exports
- environment usage
- routes
- API routes
- changed styles
- changed tests

Check for:

- deleted files
- duplicate components
- duplicate formulas
- duplicate calculations
- duplicate FX systems
- duplicate marketplace registries
- unused imports
- invalid imports
- unsupported package exports
- incorrect package identity
- broken paths
- nested folders
- wrapper folders
- browser/server boundary mistakes
- hydration risks
- environment-variable mistakes
- hard-coded FX rates
- currency-symbol-only conversion
- NaN
- Infinity
- mobile CSS breakage
- missing accessibility
- broken SEO
- accidental route deletion
- accidental URL changes
- unnecessary dependencies

Also verify:

- no accidental package-name change
- no accidental route deletion
- no accidental URL change
- no wrapper folder
- no second application
- no duplicate calculation engine
- no duplicate FX system
- no duplicate marketplace registry
- no unsupported dependency import
- no dependency-resolution drift without justification


============================================================
53. FINAL BUILD / INSTALL GATE
============================================================

First detect the package manager from the repository:

- package-lock.json → npm
- pnpm-lock.yaml → pnpm
- yarn.lock → yarn

Use the existing package manager.

If node_modules already exists and the lockfile is valid:

DO NOT reinstall dependencies unnecessarily.

If dependencies changed or installation is missing/incomplete:

use the existing package manager with the repository's lockfile.

Then run the appropriate available scripts:

typecheck
lint
test
build

Do not regenerate dependency resolution without a reason.

Do not switch package managers.

Do not create a new lockfile.

Do not delete or replace the lockfile merely to make installation succeed.

If package-manager state is inconsistent:

diagnose it first.

Only make dependency-resolution changes when technically necessary.

Document the reason for any dependency or lockfile change.

If a package-manager command is unavailable:

report the actual blocker.

Do not substitute a different package manager merely to force a result.


============================================================
54. NO FAKE SUCCESS
============================================================

Never claim:

"Done"

merely because files changed.

Never claim:

"Build passed"

unless the build actually passed.

Never claim:

"Tests passed"

unless tests actually passed.

Never claim:

"FX is live"

unless a real provider was successfully queried.

Never claim:

"fees verified"

unless authoritative verification actually occurred.

Never claim:

"production verified"

unless the relevant production verification actually occurred.

The final report must distinguish:

PASSED
FAILED
NOT RUN
BLOCKED
MOCKED


============================================================
55. FINAL REPORT
============================================================

Return an honest engineering report containing:

1. project identity preserved
2. root structure preserved
3. files changed
4. files added
5. files deleted
6. architecture changes
7. money-model changes
8. FX changes
9. calculation-engine changes
10. calculation-change impact
11. recommendation-engine changes
12. marketplace changes
13. country changes
14. CSV/SKU changes
15. homepage changes
16. visual QA result
17. accessibility changes
18. responsive verification
19. SEO changes
20. performance review
21. security review
22. tests added
23. tests passed
24. tests failed
25. tests not run
26. mocked tests
27. package-manager/install status
28. lockfile status
29. dependency changes
30. typecheck status
31. lint status
32. test status
33. production build status
34. currency acceptance status
35. FX status
36. recommendation determinism status
37. recommendation trigger-explanation status
38. homepage/full-calculator consistency status
39. marketplace data-confidence status
40. known limitations
41. external configuration required
42. marketplace data still requiring authoritative verification


============================================================
56. FINAL ACCEPTANCE CRITERIA
============================================================

Do not declare complete unless applicable items are verified.

PROJECT SAFETY

[ ] Existing project identity preserved
[ ] Existing root preserved
[ ] No nested project folder
[ ] No wrapper folder
[ ] No second application
[ ] No accidental package-name change
[ ] No accidental route deletion
[ ] Existing calculator works
[ ] Existing features preserved


MONEY / CURRENCY

[ ] Currency numerically converts
[ ] Currency symbol never changes alone
[ ] Operating currency preserved
[ ] Display currency independent
[ ] Money values carry currency context
[ ] Currency registry is centralized
[ ] No unsupported currencies introduced


FX

[ ] FX source available where configured
[ ] FX freshness available where configured
[ ] FX metadata exposed where appropriate
[ ] FX fallback behaves safely
[ ] Cached FX distinguished from stale FX
[ ] Stale FX is never presented as live/current
[ ] Historical FX semantics preserved/documented
[ ] No hard-coded fake FX rates
[ ] No fake converted amount when FX is unavailable


CALCULATION ENGINE

[ ] Central calculation source of truth
[ ] No duplicated core formulas
[ ] No double counting
[ ] No NaN
[ ] No Infinity
[ ] Break-even consistent
[ ] Target-profit consistent
[ ] Target-margin consistent
[ ] Max-ad-spend consistent
[ ] Business formula changes were impact-reviewed
[ ] Financial changes have regression tests


HOMEPAGE

[ ] Homepage upgraded
[ ] 10-second comprehension test passed
[ ] Homepage uses same calculation engine
[ ] Homepage/full-calculator result consistency verified
[ ] Result prominence verified
[ ] Trust layer visible where supported
[ ] Profit leak is data-derived
[ ] No unnecessary homepage sections
[ ] Product simplicity review passed
[ ] Progressive disclosure preserved
[ ] Homepage does not feel more complicated after upgrade


RECOMMENDATION ENGINE

[ ] Recommendations deterministic
[ ] Identical inputs produce identical recommendations
[ ] Recommendation WHY is explainable
[ ] Recommendation trigger metric is exposed
[ ] Recommendations are based on actual economics
[ ] Controllable vs uncontrollable costs distinguished
[ ] Recommendations never reference unavailable data
[ ] Recommendations never claim guaranteed improvement
[ ] Relevant driver changes can appropriately change recommendations
[ ] Recommendation thresholds are centralized where applicable
[ ] Recommendation boundary cases are tested


MARKETPLACE / SELLING CHANNEL

[ ] Marketplace comparison works where data exists
[ ] Only configured marketplaces are treated as marketplace registry entries
[ ] Own Store is treated separately unless the existing architecture
    explicitly models it as a marketplace
[ ] Native/local marketplace economics remain primary
[ ] Local margin remains primary ranking signal
[ ] Local contribution profit remains secondary ranking signal
[ ] Converted reporting profit remains secondary
[ ] FX alone does not determine primary marketplace ranking
[ ] Marketplace confidence/freshness is considered
[ ] Weak/stale data does not create false precision
[ ] Unsupported marketplace/selling-channel data is not invented


COUNTRY / SELLER INTELLIGENCE

[ ] Country comparison works where data exists
[ ] CSV works where existing feature exists
[ ] SKU analysis works where existing feature exists
[ ] Historical source currency preserved
[ ] No invented deductions
[ ] Unclassified differences remain unclassified where evidence is insufficient


ACCESSIBILITY / RESPONSIVE

[ ] Accessibility reviewed
[ ] Keyboard operation verified
[ ] Visible focus verified
[ ] Semantic controls preserved
[ ] Responsive behavior verified
[ ] 320px verified
[ ] 360px verified
[ ] 390px verified
[ ] 430px verified
[ ] 768px verified
[ ] 1024px verified
[ ] 1280px verified
[ ] 1440px verified


SEO / PERFORMANCE / SECURITY

[ ] SEO preserved
[ ] Metadata preserved
[ ] Sitemap preserved
[ ] Robots preserved
[ ] URLs preserved unless justified
[ ] Performance reviewed
[ ] Client/server boundaries reviewed
[ ] Hydration risks reviewed
[ ] Security reviewed
[ ] Privacy reviewed


DEPENDENCY / BUILD SAFETY

[ ] No unnecessary new dependency introduced
[ ] Existing package manager preserved
[ ] Existing lockfile preserved unless technically necessary
[ ] No unsupported package exports/imports introduced
[ ] No dependency-resolution drift without justification
[ ] Existing build-safe PostCSS architecture preserved


VERIFICATION

[ ] TypeScript passes
[ ] Lint passes
[ ] Tests pass
[ ] Production build passes
[ ] Final tree inspected
[ ] Final diff inspected
[ ] Success claims backed by actual verification


============================================================
57. QUALITY PRIORITY
============================================================

Prioritize:

CORRECTNESS
>
DATA INTEGRITY
>
CALCULATION CONSISTENCY
>
REGRESSION SAFETY
>
BUILD SAFETY
>
ACCESSIBILITY
>
PERFORMANCE
>
UX
>
VISUAL DECORATION

Architectural sources of truth:

1. ONE SOURCE OF TRUTH FOR MONEY
2. ONE SOURCE OF TRUTH FOR CALCULATIONS
3. ONE SOURCE OF TRUTH FOR MARKETPLACE CONFIGURATION
4. ONE SOURCE OF TRUTH FOR FX

When trade-offs occur:

Correctness beats visual complexity.

Trust beats feature quantity.

Data integrity beats convenience.

Regression safety beats speculative refactoring.

A smaller correct implementation is preferable to a larger fragile one.


============================================================
58. ABSOLUTE STOP CONDITIONS
============================================================

STOP AND EXPLAIN instead of inventing a workaround if:

- project root cannot be identified confidently
- source files are incomplete
- existing economics are ambiguous
- changing an existing formula could alter business results without
  sufficient verification
- required external credentials are unavailable
- a dependency is incompatible
- required marketplace data cannot be verified
- existing functionality would need to be deleted
- build errors cannot be safely resolved
- safe FX configuration is impossible
- a lockfile/package-manager state cannot be safely reconciled
- a financial result cannot be made trustworthy

Never guess.

Never fabricate.

Never silently change business economics.

Never hide an unresolved problem behind a UI fallback.


============================================================
59. FINAL EXECUTION INSTRUCTION
============================================================

Inspect first.

Understand second.

Audit third.

Plan fourth.

Implement fifth.

Test sixth.

Build seventh.

Perform visual QA eighth.

Inspect final diff/tree ninth.

Report honestly tenth.

The final result MUST be a production-safe enhancement of:

ecom-profit-calculator

with ProfitPilot remaining the product/brand identity.

The objective is NOT to create the biggest homepage.

The objective is to create the clearest, most trustworthy, fastest,
most useful version of the EXISTING homepage and calculator experience.

The visitor should understand:

WHAT IS THIS?
→
IS MY PRODUCT ACTUALLY PROFITABLE?
→
WHY?
→
WHAT SHOULD I TEST NEXT?
→
WHAT HAPPENS UNDER DIFFERENT SCENARIOS?
→
HOW CAN I GO DEEPER?

Every number must have an understandable source.

Every recommendation must have an understandable reason.

Every architectural change must have a technical reason.

Every financial formula change must have regression evidence.

Every dependency change must have a technical reason.

Every success claim must be backed by an actual verification.

Never optimize for appearance at the expense of calculation integrity.

Never optimize for feature count at the expense of simplicity.

Never optimize for speed at the expense of trust.

Never optimize for green build output by hiding real errors.

Never use fake data, fake confidence, fake verification, fake AI,
fake marketplace economics, or fake FX state.

The final implementation should feel like a refined evolution of the
existing product—not a replacement application.

============================================================
END OF MASTER-OF-MASTER PROMPT
============================================================
