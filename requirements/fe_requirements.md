# Project Overview

## Core Features

### Company Management

- Ability to register and manage multiple client companies.
- Assign roles and permissions for company staff (e.g., Admins, Finance Managers).
- Dashboard to overview company-owned buildings and associated data.

### Building and Apartment Management

- Manage detailed records of buildings, including addresses, property IDs, and categories (e.g., commercial, residential).
- Track individual apartments within each building with metadata such as unit numbers, sizes, occupancy status, and valuation.
- Upload blueprints or layouts of buildings and apartments for easy reference.

### Contractor Management

- Add and manage contractors associated with each company.
- Assign contractors to specific buildings or tasks (e.g., cleaning, maintenance, elevator repairs).
- Define contractor service agreements, including scope of work, costs, and timelines.
- Monitor contractor performance and generate service reports.

### Tax Calculation and Management

- Automated property tax calculation based on building and apartment data, such as size, location, and property type.
- Include configurable tax rules and formulas based on local government regulations.
- Generate tax invoices for each building or apartment unit.
- Support tax adjustments, exemptions, and penalties.

### Payment Processing

- Allow companies to process property tax payments within the system.
- Provide multiple payment options (e.g., bank transfers, online payment gateways).
- Issue payment receipts and maintain transaction history.

### Reporting and Analytics

- Generate reports on tax liabilities for each building, apartment, or the entire portfolio.
- Track paid vs. unpaid taxes with visual indicators.
- Provide insights on contractor performance, operational costs, and trends.
- Export reports in various formats (PDF, CSV, etc.).

### Notifications and Alerts

- Automated reminders for upcoming tax deadlines, overdue payments, or contractor task milestones.
- Customizable notification channels (email, SMS, system notifications).

### User and Role Management

- Multi-tiered access control (e.g., Admins, Contractors, Finance Managers).
- Define permissions for users to access specific buildings, apartments, or functionalities.

---

## Feature Requirements

- We will use React built in Vite.
- We will use Shadcn UI for components.
- We will use React Router for navigation.
- We will use Zod for data validation.
- We will use Redux Toolkit for state management and Redux Query for data fetching.
- Implement login and register pages.
- Implement create, edit, and delete company pages.
- Implement `company.service.ts` to handle company data fetching and mutations.
- Implement `api.utils.ts` to handle API requests with `createBaseQuery` and `createApi`:

  ```ts
  import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

  const baseUrl = process.env.API_URL || 'http://localhost:3000/';

  const createBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  });

  export const baseQueryWithOnQueryStarted = async (
    args: any,
    api: any,
    extraOptions: any
  ): Promise<any> => {
    try {
      // Implementation here
    } catch (error) {
      console.error('Error during baseQuery execution:', error);
    }
  };
  ```

---

## Current File Structure
