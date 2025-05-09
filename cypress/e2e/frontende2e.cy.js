describe('Titanic Survival Calculator App', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display the landing page correctly', () => {
        cy.get('img[alt="Titanic Survival Calculator Logo"]', { timeout: 20000 }).should('be.visible');
        cy.contains('Titanic Survival Calculator', { timeout: 20000 }).should('be.visible');
        cy.contains('Go to Survival Calculator', { timeout: 20000 }).should('be.visible');
    });

    it('should navigate to the survival calculator page', () => {
        cy.contains('Go to Survival Calculator', { timeout: 20000 }).click({ force: true });
        cy.url().should('include', '/calculator');
        cy.contains('Survival Calculator', { timeout: 20000 }).should('be.visible');
    });

    it('should toggle dark mode', () => {
        cy.get('body').should('have.css', 'background-color').then((bgColor) => {
            cy.log('Initial background color:', bgColor);
        });

        cy.get('input[type="checkbox"]').check({ force: true });
        cy.screenshot('after-dark-mode-toggle');
        cy.log('Dark mode toggled.');

        cy.get('body', { timeout: 20000 }).should('have.css', 'background-color').then((bgColor) => {
            cy.log('Dark mode background color:', bgColor);
        });
    });

    it('should calculate survival chances', () => {
        cy.contains('Go to Survival Calculator', { timeout: 20000 }).click({ force: true });

        cy.get('[aria-labelledby="title-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Mr').click({ force: true });

        cy.get('[aria-labelledby="pclass-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('First').click({ force: true });

        cy.get('[aria-labelledby="sex-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Male').click({ force: true });

        cy.get('input[type="number"]').eq(0).should('be.visible').then(($input) => {
            cy.log('Found Age input:', $input);
            cy.wrap($input).click({ force: true }).clear({ force: true }).type('25', { force: true });
        });
        cy.get('input[type="number"]').eq(1).should('be.visible').then(($input) => {
            cy.log('Found Fare input:', $input);
            cy.wrap($input).click({ force: true }).clear({ force: true }).type('100', { force: true });
        });

        cy.get('[aria-labelledby="embarked-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Southampton').click({ force: true });

        cy.get('input[type="checkbox"]').eq(0).check({ force: true });

        cy.get('[aria-labelledby="ml-model-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Random Forest').click({ force: true });

        cy.get('button[aria-label="Calculate"]', { timeout: 20000 }).click({ force: true });

        cy.get('.MuiAlert-message', { timeout: 20000 }).should('be.visible').then(() => {
            cy.log('Survival calculation result is displayed.');
        });
    });

    it('should reset the form', () => {
        cy.contains('Go to Survival Calculator', { timeout: 20000 }).click({ force: true });

        cy.get('[aria-labelledby="title-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Mr').click({ force: true });

        cy.get('[aria-labelledby="pclass-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('First').click({ force: true });

        cy.get('[aria-labelledby="sex-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Male').click({ force: true });

        cy.get('input[type="number"]').eq(0).should('be.visible').then(($input) => {
            cy.log('Found Age input:', $input);
            cy.wrap($input).click({ force: true }).clear({ force: true }).type('25', { force: true });
        });
        cy.get('input[type="number"]').eq(1).should('be.visible').then(($input) => {
            cy.log('Found Fare input:', $input);
            cy.wrap($input).click({ force: true }).clear({ force: true }).type('100', { force: true });
        });

        cy.get('[aria-labelledby="embarked-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Southampton').click({ force: true });

        cy.get('[aria-labelledby="ml-model-label"]').click({ force: true });
        cy.get('ul[role="listbox"]', { timeout: 20000 }).contains('Random Forest').click({ force: true });

        cy.get('button[aria-label="Reset"]', { timeout: 20000 }).click({ force: true });

        cy.wait(500);

        cy.get('input[type="number"]').eq(0).should('have.value', '').then(() => {
            cy.log('Form age field reset.');
        });
        cy.get('input[type="number"]').eq(1).should('have.value', '').then(() => {
            cy.log('Form fare field reset.');
        });
    });

    it('should display history', () => {
        cy.contains('Go to Survival Calculator', { timeout: 20000 }).click({ force: true });

        cy.get('button[aria-label="History"]', { timeout: 20000 }).should('be.visible').click({ force: true });

        cy.get('.MuiDrawer-root', { timeout: 20000 }).should('be.visible').then(() => {
            cy.log('History drawer is displayed.');
        });
    });
});
