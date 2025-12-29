# Feature Input: Specification-Driven Testing

## Purpose
Feature files written in Gherkin serve as **ephemeral specifications for AI-driven test creation**. They are used as prompts for the AI and are **NOT** stored in the repository.

## 🔄 Workflow

1. **Write Gherkin specifications** - You create feature files with test scenarios (or write them directly in chat)
2. **Provide to AI** - Share the feature file content via chat as a prompt
3. **AI generates Playwright tests** - The AI translates scenarios directly into:
   - Page Objects (`tests/pages/*.ts`)
   - Step classes (`tests/steps/*.ts`)
   - Playwright spec files (`tests/specs/*.spec.ts`)
4. **Discard Gherkin** - The Gherkin file is no longer needed once the code is generated. The TypeScript code is the source of truth.

## ✅ What This Approach Provides

- **Clear requirements** - Gherkin provides structured, business-readable specs
- **AI-friendly format** - Easy for AI to parse and convert to tests
- **Pure Playwright** - No Cucumber overhead, faster execution
- **Maintainability** - Standard Playwright patterns (Page Objects + Steps)
- **Flexibility** - No step definition mapping maintenance

## Gherkin Structure for Specifications

```gherkin
@regression
Feature: User Authentication
  As a user
  I want to authenticate
  So that I can access protected features

  Background:
    Given the landing page is open

  @smoke @test_01
  Scenario: Successful login
    When I click on the Signup / Login button
    And I enter valid login credentials
    And I click the login button
    Then I should be logged in as "username"

  @test_02
  Scenario Outline: Invalid login attempts
    When I enter email "<email>" and password "<password>"
    And I click the login button
    Then I should see error message "<error_message>"

    Examples:
      | email             | password    | error_message               |
      | invalid@test.com  | wrongpass   | Incorrect email or password |
      | valid@test.com    |             | Password is required        |
```

## Language Guidelines

- **Business-level language** - Use domain terms, not technical details
- **User perspective** - Write from user's view, not system's
- **No implementation details** - Avoid CSS selectors, IDs, HTML structure
- **Clear test IDs** - Use tags like `@test_01`, `@test_02` for traceability

## Step Patterns

- **GIVEN** - Preconditions: `Given I am on the home page`
- **WHEN** - Actions: `When I add a "Blue Top" to cart`
- **THEN** - Assertions: `Then I should see the product in the cart`
- **AND/BUT** - Continuation: `And the cart total is "500"`

## Common Tags

```gherkin
@smoke @regression @integration @ui @api @checkout @account
@test_01 @test_02 @test_03  # Individual test identification
```

## How AI Translates Scenarios

**From this Gherkin:**
```gherkin
@test_01
Scenario: Register User
  Given the Automation Exercise landing page is open
  When I click Signup / Login
  And I enter name and email to signup
  And I fill account details
  And I click Create Account
  Then I should see 'ACCOUNT CREATED!'
```

**To this Playwright spec:**
```typescript
test('Test 01: Register User', 
  { tag: ['@account', '@test_01'] }, 
  async ({ 
    automationExerciseLandingSteps,
    automationExerciseNavigationSteps,
    automationExerciseSignupSteps 
  }) => {
    const name = testDataGenerator.randomFullName();
    const email = testDataGenerator.randomEmail();
    
    await automationExerciseLandingSteps.verifyPageOpened();
    await automationExerciseNavigationSteps.clickSignupLogin();
    await automationExerciseSignupSteps.signup(name, email);
    // ... further steps
    await automationExerciseSignupSteps.verifyAccountCreated();
});
```

## Best Practices

1. **One scenario = One test** - Each scenario becomes a separate `test()` in Playwright
2. **Descriptive test names** - Use clear, business-focused test descriptions
3. **Tagging strategy** - Tag by feature area, test type, and unique ID
4. **Background for setup** - Use `Background:` for common preconditions
5. **Examples for data-driven** - Use `Scenario Outline` + `Examples` for parameterized tests

## Next Steps After Specification

Once AI receives your Gherkin specification, it will:

1. **Check maps first** - Review `page-object-map.md` and `steps-map.md` for existing code
2. **Extract locators using MCP** - Use Playwright MCP to find robust selectors
3. **Create/Update Page Objects** - Add elements and methods to page classes
4. **Create/Update Steps** - Add business-level methods to steps classes  
5. **Generate spec files** - Create Playwright test files with proper assertions
6. **Update maps** - Document new Page Objects and Steps methods
7. **Verify tests pass** - Run tests and fix any issues