import React from 'react';
import { Typography, Box, List, ListItem, Container } from '@mui/material';
import { themeSetup } from '@styles/theme';

const listStyle = {
  mt: '-18px',
  pl: '40px',
  mb: 1,
  listStyleType: 'disc',
  fontSize: '18px',
  color: themeSetup.dark.secondaryText,
  '& li': {
    display: 'list-item',
    '& p': {
      fontSize: '18px',
    },
    pl: 0,
    pb: 0,
  },
};

const ErgopadTermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Ergopad Terms of Service
        </Typography>

        <Typography variant="body2">Last modified: October 2, 2023</Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          1. Introduction
        </Typography>

        <Typography variant="body2">
          1.1 These Terms of Service (hereinafter referred to as
          &quot;Terms&quot;) govern the use and conditions of the website
          located at{' '}
          <Typography
            component="a"
            href="https://ergopad.io"
            rel="noopener"
            sx={{ fontSize: '18px' }}
          >
            https://ergopad.io
          </Typography>{' '}
          (hereinafter referred to as the &quot;Website&quot;) and the services
          provided by Benevolent SA de CV (hereinafter referred to as the
          &quot;Company&quot; or &quot;We&quot; or &quot;Us&quot;), a
          corporation registered in El Salvador. These Terms constitute a
          binding and enforceable legal contract between the Company and its
          affiliates and subsidiaries worldwide, and you, an end user of the
          Services (hereinafter referred to as &quot;You&quot; or
          &quot;User&quot;) in relation to the Services. By accessing,
          registering, using, or clicking on the Services and information made
          available by the Company via the Website or by agreeing to use the
          Services to deploy your token project, you hereby accept and agree to
          all the Terms set forth herein. If you do not agree to these Terms,
          you may not access or use the Website and the Services.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          2. Definitions
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              &quot;Affiliate&quot; means, in relation to a person, any company
              or other entity, whether or not with legal personality, which
              directly or indirectly controls, is controlled by, or is under
              joint control with that person.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Applicable Laws&quot; refers to acts, statutes, regulations,
              ordinances, treaties, guidelines, and policies issued by
              governmental organizations or regulatory bodies relevant to a
              certain party.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Company&quot; refers to Benevolent SA de CV.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Platform&quot; refers to Ergopad, the online platform
              operated by the Company. This may also be referred to
              interchangeably as Interface or Website.{' '}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Project&quot; refers to any Project launched on the
              Platform.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Services&quot; refers to the features, functionalities, and
              offerings provided by the Company through the Website. These may
              include but are not limited to access to the online platform, the
              exchange of cryptocurrencies or tokens, participation in token
              sales or staking activities, access to information, using the
              launchpad to deploy your token project, and any other services
              made available by the Company through the Website.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Tokens&quot; refers to Ergopad Tokens and any other Project
              Tokens available on the Platform.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;User(s)&quot; refers to individuals or entities accessing
              and using the Services provided via the Platform.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Website&quot; refers to the website associated with the
              Platform.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              &quot;Interface&quot; refers to any interface used to access the
              Services associated with the Platform, including the Website.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom>
          3. General Provisions
        </Typography>

        <Typography variant="body2">
          3.1 Contractual Relationship: These Terms constitute a valid and
          binding agreement between You and the Company. The binding obligations
          stipulated in these Terms are enforceable. To access or use the
          Platform, you must be able to form a legally binding contract with us.
          Accordingly, you represent that you are at least the age of majority
          in your jurisdiction (e.g., 18 years old) and have the full right,
          power, and authority to enter into and comply with the terms and
          conditions of this Agreement on behalf of yourself and any company or
          legal entity for which you may access or use the Platform.
        </Typography>

        <Typography variant="body2">
          3.2 Revision and Amendments: The Company reserves the right to revise,
          amend, or update any clauses and provisions stipulated in these Terms
          in its sole discretion at any time. You are advised to check these
          Terms periodically to ensure that you are cognizant of the current
          versions and comply with them.
        </Typography>

        <Typography variant="body2">
          3.3 Privacy Policy: The Company collects, uses, stores, and protects
          user data in accordance with applicable data protection laws and our
          Anti-Money Laundering (AML) Policy. Users can refer to our{' '}
          <Typography
            component="a"
            href="https://ergopad.io/privacy"
            rel="noopener"
            sx={{ fontSize: '18px' }}
          >
            Privacy Policy
          </Typography>{' '}
          for more details on data retention and management.
        </Typography>

        <Typography variant="body2">
          3.4 Links to and from the Website: You may gain access from the
          Website to third-party services operated or made available by persons
          other than us (&quot;Third-Party Services&quot;). Such hyperlinks are
          provided for your convenience, and the Company has no control over the
          content of these sites or resources. The Company accepts no
          responsibility for them or for any loss or damage that may arise from
          your use of them.
        </Typography>

        <Typography variant="body2">
          3.5 Disclaimer for Accessibility of the Website and the Services: The
          Website and the Services are provided on an &quot;AS IS&quot; and
          &quot;AS AVAILABLE&quot; basis. The Company makes no warranty or
          representation regarding the accuracy, completeness, or timeliness of
          the information provided on the platform. Users accept that any
          reliance on such information is at their own risk. Additionally, the
          platform may occasionally be unavailable due to maintenance or other
          reasons. The Company will endeavor to schedule maintenance during
          off-peak hours and provide users with advance notice whenever
          possible. However, unplanned outages or emergency maintenance may
          occur, and the Company will not be liable for any inconvenience or
          loss resulting from such outages.
        </Typography>

        <Typography variant="body2">
          3.6 Governing Law and Jurisdiction: These Terms and your use of the
          Website and the Services shall be governed by and construed in
          accordance with the laws of El Salvador. Any dispute arising out of or
          in connection with these Terms shall be subject to the exclusive
          jurisdiction of the courts of El Salvador.
        </Typography>

        <Typography variant="body2">
          3.7 Eligibility: As a user of the Platform, you declare and guarantee
          that you are not presently subjected to any economic or trade
          sanctions enforced by any governmental authority or organization, nor
          are you listed as a prohibited or restricted party, including listings
          maintained by the United Nations. Furthermore, you affirm and
          guarantee that you are not a citizen, resident, or organized in a
          jurisdiction or territory that is currently under comprehensive
          country-wide, territory-wide, or regional economic sanctions imposed
          by the United Nations. You further represent and warrant that your
          access and use of the Platform will comply with all applicable laws
          and regulations, and that you will not use the Platform to conduct,
          promote, or facilitate any illegal activity. This includes but not
          limited to money laundering, terrorist financing, fraud, or any other
          illegal activities.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          4. Risk Disclosure
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          4.1 By accessing the Website or using the Company Services, you
          acknowledge and assume the following risks:
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              Risk of Loss in Value: Tokens and digital currencies lack backing
              by central banks or hard assets, and their value is influenced by
              various factors, including market conditions and regulatory
              measures. This volatility may lead to partial or total loss of the
              Tokens&apos; value. No guarantees are provided regarding liquidity
              or market price.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Regulatory Regime: The regulatory framework for tokens and digital
              currencies is subject to revision and may materially affect Token
              value or User access to wallets and blockchains.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Technical and System Failures: The Website and associated
              blockchain infrastructure may experience system failures,
              interruptions, defects, security breaches, or other causes beyond
              the Company&apos;s control. Hacks, cyber-attacks, and other
              incidents may occur without timely detection, potentially
              impacting the security and stability of the Company&apos;s network
              and services.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom>
          5. Terms of Use
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          5.1 User Obligations: By using the Website and the Services, you agree
          to comply with all applicable laws and regulations. You shall not
          engage in any activity that is illegal, unethical, or violates these
          Terms. Prohibited activities include but are not limited to:
        </Typography>

        <List sx={listStyle}>
          <ListItem>
            <Typography>
              Engaging in any form of market manipulation or fraudulent
              activities.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Attempting to gain unauthorized access to the platform or other
              users&apos; accounts.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Introducing malware, viruses, or any other harmful code that may
              disrupt or compromise the platform&apos;s security.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Engaging in any illegal activities or violating applicable laws
              and regulations.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="body2">
          5.2 Account Registration: In order to access certain features or
          Services on the Website, you may be required to create an account and
          provide accurate and complete information. You are responsible for
          maintaining the confidentiality of your account credentials and for
          all activities that occur under your account.
        </Typography>

        <Typography variant="body2">
          5.3 Intellectual Property: The Company grants you a limited,
          non-exclusive, non-transferable license to access and use the
          intellectual property owned or licensed by the Company solely for the
          purpose of using the Platform and its Services. You shall not
          reproduce, modify, distribute, or exploit the Company&apos;s
          intellectual property without prior written consent.
        </Typography>

        <Typography variant="body2">
          5.4 Limitation of Liability: Notwithstanding any provisions within
          these Terms, in no event will the Company, its partners, affiliates,
          employees, agents, officers, or directors be liable to you for any
          incidental, special, exemplary, punitive, indirect, or consequential
          damages of any kind, arising out of or in connection with your use of
          the Website, the Services, or any other items obtained through the
          Website.
        </Typography>

        <Typography variant="body2">
          5.5 Indemnification: You agree to indemnify and hold harmless the
          Company, its affiliates, licensors, shareholders, officers, directors,
          managers, employees, and agents from any losses, claims, actions,
          damages, demands, liabilities, costs, and expenses arising out of or
          related to your use or participation in the Services.
        </Typography>

        <Typography variant="body2">
          5.6 No Financial and Legal Advice: The Company is not your broker,
          intermediary, agent, or legal advisor. No communication or information
          provided by the Company shall be considered as investment advice,
          financial advice, or legal advice. You should consult independent
          professionals before executing any transactions or investments.
        </Typography>

        <Typography variant="body2">
          5.7 Dispute Resolution: Any dispute arising out of or in connection
          with these Terms shall initially be resolved through good faith
          negotiations between the parties. If the dispute cannot be resolved
          through negotiations within thirty (30) days, either party may propose
          to resolve the dispute through binding arbitration. The arbitration
          shall be conducted in El Salvador, in accordance with the rules of a
          recognized arbitration institution mutually agreed upon by the
          parties. If the parties cannot agree on an arbitration institution,
          the arbitration shall be conducted under the rules of the
          International Chamber of Commerce. Any dispute not resolved through
          negotiation or arbitration shall be subject to the exclusive
          jurisdiction of the courts of El Salvador.
        </Typography>

        <Typography variant="body2">
          5.8 Severability: If any provision of these Terms is found to be
          invalid, illegal, or unenforceable, the remaining provisions shall
          continue to be valid and enforceable to the fullest extent permitted
          by law.
        </Typography>

        <Typography variant="body2">
          5.9 Suspension or Termination of Services: The Company reserves the
          right to suspend or terminate your access to the services without
          prior notice if you engage in any prohibited activities, violate the
          terms of service, or if your continued use poses a risk to the
          platform or other users. In the event of termination, users are
          responsible for retrieving their tokens from the staking platform.
          While the code is open source, and the staking platform is deployed
          via smart contracts on the Ergo blockchain, users will need to
          determine the appropriate steps to retrieve their tokens and unlock
          any outstanding vested tokens. The Company will not be responsible for
          any loss, inconvenience, or challenges faced by users in this regard.
        </Typography>

        <Typography variant="body2">
          5.10 Modification of Services: The Company reserves the right to
          modify, update, or discontinue certain features or functionalities of
          the platform at any time without prior notice. The Company shall not
          be liable to you or any third party for any modification, suspension,
          or discontinuation of the services.
        </Typography>
        <Typography variant="body2">
          5.11.1 Platform Role: The Platform serves as an intermediary
          facilitating token sales between third-party companies ("Issuers") and
          Users. The Company does not issue tokens directly and does not take
          responsibility for the creation, listing, or management of tokens. If
          the Company takes part in those activities, it is solely on the behalf
          of token Issuers and/or Projects launching through the Platform.
        </Typography>
        <Typography variant="body2">
          5.11.2 Issuer Responsibility: Issuers utilizing the platform to launch
          their tokens are solely responsible for the tokens they issue,
          including their legality, functionality, and associated claims. The
          Company does not endorse, verify, or validate any Issuer or their
          token offerings.
        </Typography>
        <Typography variant="body2">
          5.11.3 User Responsibility: Users are responsible for performing their
          own research and due diligence before participating in any token sale
          facilitated by the Platform. Engaging in any such sales is at the
          User's own risk.
        </Typography>

        <Typography variant="body2">
          5.12 Fees: The Platform may charge users minor fees during certain
          transactions, such as staking. As of the last update of this document,
          the fee for staking is 0.26 erg. These fees are subject to change, and
          users will not be notified of any adjustments. Fees will be clearly
          visible in any blockchain transaction initiated while using the
          Platform. All fees are non-refundable and are used to support the
          maintenance and operations of the Platform.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          6. Force Majeure
        </Typography>

        <Typography variant="body2">
          6.1 The Company shall not be liable for any failure or delay in the
          performance of its obligations under these terms resulting from events
          beyond its reasonable control, including but not limited to natural
          disasters, acts of government, or technical malfunctions.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          7. Entire Agreement
        </Typography>

        <Typography variant="body2">
          7.1 These terms constitute the entire agreement between you and the
          Company regarding your use of the platform and supersede any prior
          agreements or understandings.
        </Typography>
      </Box>
    </Container>
  );
};

export default ErgopadTermsOfService;
