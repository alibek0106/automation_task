import { AutomationExerciseLandingSteps } from '../steps/AutomationExerciseLandingSteps';
import { AutomationExerciseLoginSteps } from '../steps/AutomationExerciseLoginSteps';
import { AutomationExerciseSignupSteps } from '../steps/AutomationExerciseSignupSteps';
import { AutomationExerciseNavigationSteps } from '../steps/AutomationExerciseNavigationSteps';
import { AutomationExerciseProductsSteps } from '../steps/AutomationExerciseProductsSteps';
import { AutomationExerciseProductDetailSteps } from '../steps/AutomationExerciseProductDetailSteps';
import { AutomationExerciseCartSteps } from '../steps/AutomationExerciseCartSteps';
import { PagesFixture } from './pages.fixture';

export interface StepsFixture {
    automationExerciseLandingSteps: AutomationExerciseLandingSteps;
    automationExerciseLoginSteps: AutomationExerciseLoginSteps;
    automationExerciseSignupSteps: AutomationExerciseSignupSteps;
    automationExerciseNavigationSteps: AutomationExerciseNavigationSteps;
    automationExerciseProductsSteps: AutomationExerciseProductsSteps;
    automationExerciseProductDetailSteps: AutomationExerciseProductDetailSteps;
    automationExerciseCartSteps: AutomationExerciseCartSteps;
}

export const stepsFixture = {
    automationExerciseLandingSteps: async ({ automationExerciseLandingPage }: PagesFixture, use: (s: AutomationExerciseLandingSteps) => Promise<void>) => {
        await use(new AutomationExerciseLandingSteps(automationExerciseLandingPage));
    },
    automationExerciseLoginSteps: async ({ automationExerciseLoginPage }: PagesFixture, use: (s: AutomationExerciseLoginSteps) => Promise<void>) => {
        await use(new AutomationExerciseLoginSteps(automationExerciseLoginPage));
    },
    automationExerciseSignupSteps: async ({ automationExerciseSignupPage, accountCreatedPage }: PagesFixture, use: (s: AutomationExerciseSignupSteps) => Promise<void>) => {
        await use(new AutomationExerciseSignupSteps(automationExerciseSignupPage, accountCreatedPage));
    },
    automationExerciseNavigationSteps: async ({ automationExerciseNavigationMenu }: PagesFixture, use: (s: AutomationExerciseNavigationSteps) => Promise<void>) => {
        await use(new AutomationExerciseNavigationSteps(automationExerciseNavigationMenu));
    },
    automationExerciseProductsSteps: async ({ automationExerciseProductsPage }: PagesFixture, use: (s: AutomationExerciseProductsSteps) => Promise<void>) => {
        await use(new AutomationExerciseProductsSteps(automationExerciseProductsPage));
    },
    automationExerciseProductDetailSteps: async ({ automationExerciseProductDetailPage }: PagesFixture, use: (s: AutomationExerciseProductDetailSteps) => Promise<void>) => {
        await use(new AutomationExerciseProductDetailSteps(automationExerciseProductDetailPage));
    },
    automationExerciseCartSteps: async ({ automationExerciseCartPage }: PagesFixture, use: (s: AutomationExerciseCartSteps) => Promise<void>) => {
        await use(new AutomationExerciseCartSteps(automationExerciseCartPage));
    },
};
