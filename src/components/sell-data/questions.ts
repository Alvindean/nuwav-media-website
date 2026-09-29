// The 10 funnel questions. Easy multiple-choice first, contact details last.
// `id` values are the keys sent to the Google Sheet (see integrations/google-sheets).

export type Question =
  | {
      id: string;
      type: 'single';
      title: string;
      help?: string;
      options: string[];
      otherOption?: string; // selecting this reveals a free-text box
    }
  | {
      id: string;
      type: 'multi';
      title: string;
      help?: string;
      options: string[];
      otherOption?: string;
    }
  | {
      id: string;
      type: 'text' | 'email' | 'year';
      title: string;
      help?: string;
      placeholder: string;
      autoComplete?: string;
    };

export const QUESTIONS: Question[] = [
  {
    id: 'industry',
    type: 'single',
    title: 'What industry is (or was) your company in?',
    options: [
      'Finance / MCA / Lending',
      'SaaS / Software',
      'Marketing / Agency',
      'Healthcare',
      'Legal',
      'Real Estate',
      'E-commerce / Retail',
      'Professional Services',
      'Other',
    ],
    otherOption: 'Other',
  },
  {
    id: 'peakFte',
    type: 'single',
    title: 'At its peak, how many employees did the company have?',
    help: 'Include full-time staff and regular contractors.',
    options: ['1–10', '11–25', '26–50', '51–100', '101–250', '250+'],
  },
  {
    id: 'yearFounded',
    type: 'year',
    title: 'What year did the company start operating?',
    placeholder: 'e.g. 2019',
  },
  {
    id: 'dataSources',
    type: 'multi',
    title: 'Which tools did your team work in?',
    help: 'Select all that apply. These are the data sources buyers value most.',
    options: [
      'Gmail / Google Workspace',
      'Microsoft 365 / Outlook',
      'Slack',
      'Microsoft Teams',
      'Google Chat',
      'Zoom',
      'Google Drive',
      'OneDrive / SharePoint',
      'Google Calendar',
      'CRM (Salesforce, HubSpot…)',
      'Project tools (Jira, Asana…)',
      'Code repos (GitHub, GitLab…)',
      'Docs / Wiki (Notion, Confluence…)',
      'Support desk (Zendesk, Intercom…)',
      'Marketing platforms',
      'Other',
    ],
    otherOption: 'Other',
  },
  {
    id: 'companyStatus',
    type: 'single',
    title: 'Is the company still operating?',
    options: ['Yes, actively operating', 'Winding down', 'Shut down / closed', 'Acquired or merged'],
  },
  {
    id: 'dataHistory',
    type: 'single',
    title: 'Roughly how many years of that data do you still have access to?',
    options: ['Less than 1 year', '1–3 years', '3–5 years', '5+ years', 'Not sure'],
  },
  {
    id: 'role',
    type: 'single',
    title: "What's your role at the company?",
    help: 'We ask so we know who can approve a sale.',
    options: ['Founder / Owner / CEO', 'Executive (C-level, VP)', 'Board member / Investor', 'Manager / Employee', 'Other'],
    otherOption: 'Other',
  },
  {
    id: 'companyName',
    type: 'text',
    title: "What's the company's name?",
    placeholder: 'Company name',
    autoComplete: 'organization',
  },
  {
    id: 'contactName',
    type: 'text',
    title: "What's your full name?",
    placeholder: 'First and last name',
    autoComplete: 'name',
  },
  {
    id: 'email',
    type: 'email',
    title: 'Where should we send your offer?',
    help: 'Use an email you check. A real person will follow up.',
    placeholder: 'you@company.com',
    autoComplete: 'email',
  },
];
