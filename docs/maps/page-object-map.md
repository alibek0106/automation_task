# Page Object Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW CODE!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Page Objects and methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing code instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Page Objects/methods

**ANTI-DUPLICATION RULES:**
- 🔴 **NEVER** create a new Page Object if one exists for the same page
- 🔴 **NEVER** create a new method if similar functionality exists
- 🔴 **NEVER** skip checking this file before coding
- 🟢 **ALWAYS** extend existing Page Objects with new methods
- 🟢 **ALWAYS** reuse existing methods, even if names differ
- 🟢 **ALWAYS** update this map after ANY changes

---

## Existing Page Objects

### AutomationExerciseLandingPage (tests/pages/AutomationExerciseLandingPage.ts)
**URL:** https://automationexercise.com/
**Purpose:** Main landing page

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| navigate() | - | Promise<void> | Navigate to Landing Page |
| verifyPageOpened() | - | Promise<void> | Verify landing page is loaded |

**Locators:**
- Page container: `body` (or specific unique element)

---

### AutomationExerciseLoginPage (tests/pages/AutomationExerciseLoginPage.ts)
**URL:** https://automationexercise.com/login
**Purpose:** Login and Signup forms

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| navigate() | - | Promise<void> | Navigate to Login Page |
| enterLoginEmail() | email: string | Promise<void> | Enter email in login form |
| enterLoginPassword() | password: string | Promise<void> | Enter password in login form |
| clickLogin() | - | Promise<void> | Click login button |
| enterSignupName() | name: string | Promise<void> | Enter name in signup form |
| enterSignupEmail() | email: string | Promise<void> | Enter email in signup form |
| clickSignup() | - | Promise<void> | Click signup button |

**Locators:**
- Login Email input: `[data-qa="login-email"]`
- Login Password input: `[data-qa="login-password"]`
- Login Button: `[data-qa="login-button"]`
- Signup Name input: `[data-qa="signup-name"]`
- Signup Email input: `[data-qa="signup-email"]`
- Signup Button: `[data-qa="signup-button"]`

---

### AutomationExerciseNavigationMenu (tests/pages/AutomationExerciseNavigationMenu.ts)
**Purpose:** Header navigation menu

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| clickHome() | - | Promise<void> | Click Home link |
| clickProducts() | - | Promise<void> | Click Products link |
| clickCart() | - | Promise<void> | Click Cart link |
| clickSignupLogin() | - | Promise<void> | Click Signup/Login link |
| clickTestCases() | - | Promise<void> | Click Test Cases link |
| clickApiTesting() | - | Promise<void> | Click API Testing link |
| clickVideoTutorials() | - | Promise<void> | Click Video Tutorials link |
| clickContactUs() | - | Promise<void> | Click Contact Us link |
| verifyUserLoggedIn() | username: string | Promise<void> | Verify "Logged in as..." text |
| clickDeleteAccount() | - | Promise<void> | Click Delete Account link |
| clickLogout() | - | Promise<void> | Click Logout link |

**Locators:**
- Home link: `a[href="/"]`
- Products link: `a[href="/products"]`
- Cart link: `a[href="/view_cart"]`
- Signup/Login link: `a[href="/login"]`
- Delete Account link: `a[href="/delete_account"]`
- Logout link: `a[href="/logout"]`

---

### AutomationExerciseSignupPage (tests/pages/AutomationExerciseSignupPage.ts)
**URL:** https://automationexercise.com/signup (ENTER ACCOUNT INFORMATION page)
**Purpose:** Account information form after initial signup

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyAccountInfoPageOpened() | - | Promise<void> | Verify "ENTER ACCOUNT INFORMATION" header visible |
| selectTitle() | title: "Mr." \| "Mrs." | Promise<void> | Select title radio button |
| enterPassword() | password: string | Promise<void> | Enter password |
| selectDateOfBirth() | day, month, year: string | Promise<void> | Select DOB from dropdowns |
| checkNewsletter() | - | Promise<void> | Check newsletter checkbox |
| checkSpecialOffers() | - | Promise<void> | Check special offers checkbox |
| enterFirstName() | firstName: string | Promise<void> | Enter first name |
| enterLastName() | lastName: string | Promise<void> | Enter last name |
| enterCompany() | company: string | Promise<void> | Enter company |
| enterAddress() | address: string | Promise<void> | Enter address line 1 |
| enterAddress2() | address2: string | Promise<void> | Enter address line 2 |
| selectCountry() | country: string | Promise<void> | Select country |
| enterState() | state: string | Promise<void> | Enter state |
| enterCity() | city: string | Promise<void> | Enter city |
| enterZipcode() | zipcode: string | Promise<void> | Enter zipcode |
| enterMobileNumber() | mobileNumber: string | Promise<void> | Enter mobile number |
| clickCreateAccount() | - | Promise<void> | Click Create Account button |

**Locators:**
- Title Mr: `#id_gender1`
- Title Mrs: `#id_gender2`
- Password: `[data-qa="password"]`
- Day: `[data-qa="days"]`
- Month: `[data-qa="months"]`
- Year: `[data-qa="years"]`
- Newsletter: `#newsletter`
- Special Offers: `#optin`
- First Name: `[data-qa="first_name"]`
- Last Name: `[data-qa="last_name"]`
- Company: `[data-qa="company"]`
- Address: `[data-qa="address"]`
- Address2: `[data-qa="address2"]`
- Country: `[data-qa="country"]`
- State: `[data-qa="state"]`
- City: `[data-qa="city"]`
- Zipcode: `[data-qa="zipcode"]`
- Mobile Number: `[data-qa="mobile_number"]`
- Create Account: `[data-qa="create-account"]`

---

### AccountCreatedPage (tests/pages/AccountCreatedPage.ts)
**Purpose:** Account creation success page

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyPageOpened() | - | Promise<void> | Verify page is visible (inherited) |
| verifyAccountCreatedMessage() | - | Promise<void> | Verify "ACCOUNT CREATED!" text |
| clickContinue() | - | Promise<void> | Click Continue button |

**Locators:**
- Container: `[data-qa="account-created"]`
- Header: `[data-qa="account-created"] h2 b`
- Continue Button: `[data-qa="continue-button"]`

---

## Method Naming Conventions

### Actions
- `click*` - Click elements
- `enter*` - Input text
- `select*` - Select from dropdowns
- `check*` - Check checkboxes
- `navigate*` - Navigate to pages

### Validations
- `verify*` - Complex validations
- `get*` - Retrieve values

---

## Update History

| Date | Page Object | Changes | Updated By |
|------|-------------|---------|------------|
| 2025-12-12 | AutomationExerciseSignupPage | Added new Page Object for signup form | AI Agent |
| 2025-12-12 | AccountCreatedPage | Added new Page Object for account created page | AI Agent |
| 2025-12-12 | AutomationExerciseLoginPage | Added verifyNewUserSignupVisible() method | AI Agent |
| 2025-12-12 | All | Reset for Automation Exercise project | System |