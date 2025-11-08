import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Logo } from 'src/components/logo';

export function PrivacyPolicyView() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0, 167, 111, 0.03) 0%, rgba(0, 167, 111, 0.01) 100%)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Logo isSingle={false} sx={{ width: 130, height: 41 }} />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          GidiNest Privacy Policy
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
          Last Updated: October 10, 2025
        </Typography>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 3, md: 4 },
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            mb: 3,
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            Welcome
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Welcome to GidiNest (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). We respect your privacy and are committed to
            protecting your personal information. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use the GidiNest mobile application,
            website, or related services (collectively referred to as &quot;the Platform&quot;). By using GidiNest, you
            agree to the practices described in this Privacy Policy.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We may collect and process the following types of information: Personal information such as
            your name, email, phone number, date of birth, gender, and location; financial information such
            as account details, transaction history, and payment preferences; optional maternal data like
            due dates or dependents; and technical data like device information, IP address, and app
            usage.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We use your information to create and manage accounts, facilitate secure savings and
            transactions, send updates and reminders, improve services, and ensure compliance with
            financial regulations. We do not sell or rent your personal data to third parties.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            3. Legal Basis for Processing
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Depending on your jurisdiction, we process data under consent, contractual necessity, legal
            obligation, or legitimate interest.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            4. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Your data may be shared only with trusted partners such as payment processors, cloud
            providers, or regulators where necessary. All partners are bound by confidentiality and
            compliance agreements.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            5. Data Security
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We use encryption, secure servers, and regular audits to protect your data, but no system is
            entirely immune to risk.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            6. Your Rights
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            You may access, correct, or delete your data, withdraw consent, or request data portability by
            contacting us.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            7. Data Retention
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We retain data only as long as needed for service delivery, legal, or regulatory compliance.
            When no longer required, we securely delete or anonymize it.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            8. Children&apos;s Privacy
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            GidiNest is not intended for children under 16 years old. We do not knowingly collect personal
            data from children.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            9. International Data Transfers
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Your data may be processed in other countries with legal safeguards in place.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            10. Updates
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We may update this Privacy Policy periodically. The revised version will be posted on our
            website with the new date.
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 3, md: 4 },
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            11. Contact Us
          </Typography>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              GidiNest Privacy Office
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
              House 3, Silverlake Estate, Idowu Dabiri Street (Beside Blenco Mall), Sangotedo, Lagos,
              Nigeria
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
              Website:{' '}
              <Box
                component="a"
                href="https://gidinest.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                https://gidinest.com/
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Email:{' '}
              <Box
                component="a"
                href="mailto:info@gidinest.com"
                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                info@gidinest.com
              </Box>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
