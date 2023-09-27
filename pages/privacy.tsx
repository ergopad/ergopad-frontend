import React from 'react';
import { Typography, Box, List, ListItem, Container } from '@mui/material';
import { themeSetup } from '@styles/theme';

const listStyle = {
  mt: '-24px',
  pl: "40px",
  mb: 1,
  listStyleType: "disc",
  fontSize: '18px',
  color: themeSetup.dark.secondaryText,
  "& li": {
    display: "list-item",
    '& p': {
      fontSize: '18px',
    },
    pl: 0,
    pb: 0
  },
}

const PrivacyPolicy = () => {

  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="body2">
          Last modified: September 26, 2023
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          1. Information We Collect
        </Typography>

        <Typography variant="body2">
          We may collect the following categories of personal data from you:
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              Contact Information: Your name, email address, phone number, and postal address.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Identification Information: Passport details, identification card details, social security number, or other government-issued identification information.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Financial Information: Blockchain transaction history.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Authentication Information: Account information used to authenticate your user account including information collected through third-party authentication providers.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Usage Data: Information about your interactions with the Platform, such as log files, IP address, browser type, and pages visited.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Cookies and Similar Technologies: No information is collected through cookies. Our server only uses an http cookie to store your session data.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom>
          2. Use of Personal Data
        </Typography>

        <Typography variant="body2">
          We may use your personal data for the following purposes:
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              Providing Financial Services: Facilitating transactions, processing payments, and managing your accounts on the Platform.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Customer Support: Responding to your inquiries, providing technical assistance, and resolving issues.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Identity Verification: Verifying your identity and conducting necessary due diligence as required by applicable laws and regulations.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Compliance with Legal Obligations: Complying with applicable laws, regulations, and legal process.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom>
          3. Disclosure of Personal Data
        </Typography>

        <Typography variant="body2">
          We may disclose your personal data to the following categories of recipients:
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              Third-Party Service Providers: Sharing personal data with trusted service providers who assist us in delivering the services and operating the Platform.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Token Issuers: Sharing personal data with token Issuers that utilize the Platform to issue cryptocurrency tokens.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Compliance with Laws: Disclosing personal data as required by applicable laws, regulations, or legal process, including requests from governmental authorities.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Business Transfers: Transferring personal data in connection with a merger, acquisition, or sale of all or a portion of our assets, subject to applicable confidentiality and data protection obligations.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Your Consent: Sharing personal data with third parties when you provide your explicit consent for such disclosure.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom>
          4. Data Retention
        </Typography>

        <Typography variant="body2">
          We will retain your personal data for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required or permitted by law. The criteria used to determine our retention periods include the nature of the personal data, the purposes for which it is collected, and legal and regulatory requirements.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          5. Security
        </Typography>

        <Typography variant="body2">
          We implement reasonable security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security of your personal data.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          6. Your Rights and Choices
        </Typography>

        <Typography variant="body2">
          You may have certain rights and choices regarding your personal data, including:
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              Access and Correction: Requesting access to or correction of your personal data that we hold.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Data Portability: Requesting a copy of your personal data in a structured, machine-readable format.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Consent Withdrawal: Withdrawing your consent for the processing of your personal data, where applicable.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Opt-Out: Opting out of receiving promotional communications from us by following the instructions provided in such communications.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Do Not Track: Adjusting your browser settings to disable tracking technologies, though we do not utilize any such technologies beyond what is used to track your login session.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom>
          7. Children&apos;s Privacy
        </Typography>

        <Typography variant="body2">
          The Platform is not intended for individuals under the age of 18. We do not knowingly collect personal data from children.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          8. Changes to this Policy
        </Typography>

        <Typography variant="body2">
          We may update this Policy from time to time by posting a revised version on the Website. The updated Policy will be effective as of the date indicated in the revised Policy. Your continued use of the Platform after the effective date constitutes your acceptance of the updated Policy.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;