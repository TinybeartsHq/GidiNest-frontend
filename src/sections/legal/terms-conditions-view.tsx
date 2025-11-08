import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Logo } from 'src/components/logo';

export function TermsConditionsView() {
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
          GidiNest Terms and Conditions
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
            1. Introduction
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Welcome to GidiNest (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). These Terms and Conditions govern your use of the
            GidiNest mobile application, website, and related services (&quot;the Platform&quot;). By using GidiNest,
            you agree to these Terms and our Privacy Policy. Please read them carefully before using our
            services.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            2. Eligibility & Registration
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            To use GidiNest, you must be at least 18 years old and legally capable of entering into a
            binding agreement. By registering, you confirm that the information you provide is accurate
            and complete. You are responsible for maintaining the confidentiality of your account details.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            3. Account Security
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            You are responsible for safeguarding your login credentials. GidiNest will not be liable for
            losses arising from unauthorized access due to your negligence or disclosure of account
            details.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            4. Savings & Financial Services
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            GidiNest provides a savings and maternal financial planning platform in partnership with
            licensed financial institutions in Nigeria. All financial transactions comply with the regulations of
            the Central Bank of Nigeria (CBN). Interest rates, savings terms, and withdrawal policies are
            subject to our partner financial institutions and applicable CBN guidelines.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            5. Use of the Platform
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            You agree to use the Platform only for lawful purposes. You must not use GidiNest to engage
            in fraudulent, misleading, or harmful activities. We reserve the right to suspend or terminate
            accounts that violate these Terms or applicable laws.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            6. Intellectual Property
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            All content, logos, trademarks, and software on the Platform are the property of GidiNest or its
            licensors. You may not copy, reproduce, or distribute any materials without prior written
            consent.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            7. Prohibited Conduct
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Users must not attempt to hack, reverse-engineer, interfere with, or disrupt the Platform&apos;s
            operations. You must not use the Platform to transmit harmful software, false information, or
            unauthorized financial activities.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            8. Limitation of Liability
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            GidiNest strives to provide reliable and secure services. However, we are not liable for indirect,
            incidental, or consequential damages arising from use or inability to use the Platform. All
            services are provided &quot;as is&quot; without warranties of any kind.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            9. Termination
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We may suspend or terminate your account at our discretion if you breach these Terms or
            engage in fraudulent or unlawful activity. You may close your account at any time by contacting
            our support team.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            10. Governing Law
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any
            disputes shall be resolved under Nigerian law, in courts with jurisdiction in Lagos State.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            11. Updates to These Terms
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We may update these Terms periodically to reflect legal, regulatory, or service changes.
            Continued use of GidiNest after updates means you accept the revised Terms.
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
            12. Contact Us
          </Typography>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              GidiNest Legal & Compliance Office
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
