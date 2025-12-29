# Locator Extraction Example

Complete walkthrough of extracting locators for a real element following [patterns/locators.md](../patterns/locators.md) methodology.

## Scenario

Extract locator for "Signup / Login" button on Automation Exercise landing page.

---

## Step 1: MCP Visual Analysis

```bash
# Navigate to page via Playwright MCP
mcp__playwright__browser_navigate(url="https://automationexercise.com/")
mcp__playwright__browser_snapshot()
```

**Visual Confirmation:**
- Element: "Signup / Login" link in header
- Location: Top right navigation menu
- Container: Navigation list
- State: Visible, clickable

---

## Step 2: Container HTML Investigation

Extract COMPLETE container DOM (not just target element):

```html
<div class="shop-menu pull-right">
    <ul class="nav navbar-nav">
        <li><a href="/"><i class="fa fa-home"></i> Home</a></li>
        <li><a href="/products"><i class="fa fa-products"></i> Products</a></li>
        <li><a href="/login"><i class="fa fa-lock"></i> Signup / Login</a></li>
        <!-- ... -->
    </ul>
</div>
```

**Key Observations:**
- Href: `/login` (unique for this link)
- Text: " Signup / Login"
- Icon: `fa-lock`
- Parent: `ul.nav.navbar-nav`

---

## Step 3: Priority Strategy

Create multiple options, verify uniqueness:

```bash
# Option 1: Href attribute (Priority 5 - Unique Attr)
curl -s "https://automationexercise.com/" | grep -c 'href="/login"'
# Result: 1 ✅ UNIQUE

# Option 2: Role + Text (Priority 3)
# //a[contains(text(), 'Signup / Login')]
# Result: 1 ✅ UNIQUE

# Option 3: Class selector (Priority 6)
# .fa-lock
# Result: 1 ✅ UNIQUE (but less robust if icon changes)
```

**Options Ranked:**
1. `a[href="/login"]` (Attribute) ✅ - Specific and stable
2. `//a[contains(., 'Signup / Login')]` (Text) ✅ - Good, but text might change
3. `.fa-lock` ❌ - Styling detail, avoid

---

## Step 4: Validation

### Uniqueness Check
```typescript
// MCP verification
await page.locator('a[href="/login"]').count()  // Returns: 1 ✅
```

### Visual Confirmation
```bash
mcp__playwright__browser_snapshot()
# Screenshot confirms correct element highlighted
```

### Stability Test
- ✅ Same locator after page reload
- ✅ Independent of dynamic content

**SELECTED:** `a[href="/login"]`

Reason: Unique attribute, robust, descriptive.

---

## Step 5: Documentation

```markdown
### Target Element: Signup / Login Link

**Visual Analysis:**
- Location: Header navigation
- Container: ul.nav.navbar-nav
- State: Visible

**Container HTML:**
```html
<li><a href="/login"><i class="fa fa-lock"></i> Signup / Login</a></li>
```

**Selected Locator:** `a[href="/login"]`
- **Type:** CSS Attribute Selector
- **Priority:** 5 (Unique Attribute)
- **Verified:** Unique ✅, Stable ✅

**Alternatives Considered:**
- `//a[contains(., 'Signup / Login')]` - Text based
- `.shop-menu a[href="/login"]` - More specific container
```

---

## Step 6: Implementation in Page Object

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

export class AutomationExerciseNavigationMenu extends BasePage {
    readonly signupLoginLink: Locator;

    constructor(page: Page) {
        super(page, page.locator(".shop-menu"), "NavigationMenu");

        // ONE verified locator per element, with .describe() for debugging
        this.signupLoginLink = page.locator('a[href="/login"]')
            .describe("Signup / Login link");
    }

    async clickSignupLogin(): Promise<void> {
        // Use BasePage methods for checks
        await this.elementToBeVisible(this.signupLoginLink);
        // Use Playwright API for interactions
        await this.signupLoginLink.click();
    }
}
```

---

## Key Takeaways

1. **Always start with MCP** - Visual confirmation prevents wrong targets
2. **Extract full container** - Context is critical for stable locators
3. **Create multiple options** - Then select ONE BEST based on priority
4. **Verify uniqueness** - Use grep/curl before committing
5. **ONE locator in Page Object** - No fallback logic

---

See [patterns/locators.md](../patterns/locators.md) for the full methodology.