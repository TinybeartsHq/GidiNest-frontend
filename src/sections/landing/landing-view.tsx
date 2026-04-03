import { useCallback } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useRouter } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

const HERO_STATS = [
  { value: '1.5%', label: 'Simple gifting fee' },
  { value: '5 steps', label: 'Gift sender journey' },
  { value: '₦0', label: 'No subscription needed' },
];

const HOW_IT_WORKS_MOTHER = [
  {
    step: '01',
    title: 'Sign Up',
    description: 'Name, email, phone. No KYC at signup — zero friction.',
    icon: 'solar:user-plus-bold-duotone',
  },
  {
    step: '02',
    title: 'Create Baby Fund',
    description: 'Fund name, target amount, due date, and a thank-you message. One screen.',
    icon: 'solar:heart-bold-duotone',
  },
  {
    step: '03',
    title: 'Share the Link',
    description: 'Get a shareable link — send via WhatsApp, Instagram, or copy it.',
    icon: 'solar:share-bold-duotone',
  },
  {
    step: '04',
    title: 'Receive & Withdraw',
    description: 'Get notified when gifts land. Withdraw to your bank anytime.',
    icon: 'solar:wallet-money-bold-duotone',
  },
];

const HOW_IT_WORKS_SENDER = [
  {
    step: '01',
    title: 'Open the Link',
    description: 'See the fund details, progress bar, and the mother\'s thank-you message.',
    icon: 'solar:link-bold-duotone',
  },
  {
    step: '02',
    title: 'Enter Your Gift',
    description: 'Amount, your name, and an optional message. No account needed.',
    icon: 'solar:gift-bold-duotone',
  },
  {
    step: '03',
    title: 'Pay Securely',
    description: 'Card, bank transfer, or USSD — Paystack handles it all.',
    icon: 'solar:shield-check-bold-duotone',
  },
];

const FEATURES = [
  {
    icon: 'solar:hand-money-bold-duotone',
    title: 'No Manual Bank Transfers',
    description: 'No more "send to 0123456789, GTBank, use PL-REF-123". Just tap and gift.',
  },
  {
    icon: 'solar:lock-bold-duotone',
    title: 'Secure Payments',
    description: 'Powered by Paystack — card, bank transfer, USSD. All verified and encrypted.',
  },
  {
    icon: 'solar:bell-bold-duotone',
    title: 'Real-Time Notifications',
    description: 'Mothers get instant push and email alerts when every gift arrives.',
  },
  {
    icon: 'solar:chart-2-bold-duotone',
    title: 'Track Your Fund',
    description: 'See who gifted, how much has been raised, and your progress toward target.',
  },
  {
    icon: 'solar:global-bold-duotone',
    title: 'Diaspora Support',
    description: 'Family abroad can gift in GBP, USD, or CAD with premium international features.',
  },
  {
    icon: 'solar:hospital-bold-duotone',
    title: 'Hospital Integration',
    description: 'Withdraw directly to verified hospitals for bills, or to your personal bank.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'I used to dread the back-and-forth of bank transfers for baby showers. GidiNest made it so simple — I just shared a link!',
    name: 'Adaeze O.',
    role: 'New Mother, Lagos',
  },
  {
    quote: 'Sending a gift from London was seamless. No more asking for account numbers or worrying if the money arrived.',
    name: 'Tunde A.',
    role: 'Uncle, London',
  },
  {
    quote: 'The progress bar on the fund page was so motivating. Our community rallied together beautifully.',
    name: 'Blessing E.',
    role: 'Mother of Twins, Abuja',
  },
];

// ----------------------------------------------------------------------

export function LandingView() {
  const theme = useTheme();
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    router.push('/register');
  }, [router]);

  const handleSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Logo isSingle={false} />
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" color="inherit" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button variant="contained" color="primary" onClick={handleGetStarted}>
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 14 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #8a4a8d 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            top: -100,
            right: -100,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            bottom: -80,
            left: -80,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack
            alignItems="center"
            textAlign="center"
            spacing={4}
            sx={{ maxWidth: 720, mx: 'auto' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              Gift with Love,
              <br />
              Welcome with Joy
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                opacity: 0.9,
                maxWidth: 560,
                lineHeight: 1.6,
              }}
            >
              The easiest way for family and friends to send baby gifts in Nigeria.
              No bank transfers, no reference codes — just love, delivered.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                size="large"
                variant="contained"
                onClick={handleGetStarted}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                Create Your Baby Fund
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                See How It Works
              </Button>
            </Stack>

            {/* Stats */}
            <Stack
              direction="row"
              spacing={{ xs: 3, md: 6 }}
              sx={{ pt: 4 }}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
                />
              }
            >
              {HERO_STATS.map((stat) => (
                <Stack key={stat.label} alignItems="center" spacing={0.5}>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Problem / Solution */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{ color: 'secondary.main', fontWeight: 700, mb: 1, display: 'block' }}
              >
                The Problem
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Baby gifting in Nigeria is broken
              </Typography>
              <Stack spacing={2}>
                {[
                  '"Send ₦25,000 to 0123456789, GTBank. Use reference PL-BABY-SHOWER-042"',
                  '"Did you send it? I haven\'t seen it yet. Can you send the receipt?"',
                  '"The money hasn\'t reflected. Let me check with my bank..."',
                ].map((text) => (
                  <Stack key={text} direction="row" spacing={1.5} alignItems="flex-start">
                    <Icon
                      icon="solar:close-circle-bold"
                      width={24}
                      style={{ color: theme.palette.error.main, marginTop: 2.4, flexShrink: 0 }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', fontWeight: 700, mb: 1, display: 'block' }}
              >
                The Solution
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                GidiNest makes it effortless
              </Typography>
              <Stack spacing={2}>
                {[
                  'Create a baby fund in 30 seconds — one screen, done.',
                  'Share a link on WhatsApp. Family taps, pays, done.',
                  'No reference codes. No "pending" anxiety. No chasing receipts.',
                ].map((text) => (
                  <Stack key={text} direction="row" spacing={1.5} alignItems="flex-start">
                    <Icon
                      icon="solar:check-circle-bold"
                      width={24}
                      style={{ color: theme.palette.success.main, marginTop: 2.4, flexShrink: 0 }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700 }}
            >
              How It Works
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Simple for everyone
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 480 }}>
              Whether you&apos;re creating a fund or sending a gift, it takes minutes — not headaches.
            </Typography>
          </Stack>

          {/* For Mothers */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 4, color: 'primary.main' }}
          >
            For Mothers
          </Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {HOW_IT_WORKS_MOTHER.map((item) => (
              <Grid key={item.step} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: 'primary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon icon={item.icon} width={32} style={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Step {item.step}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* For Gift Senders */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 4, color: 'secondary.main' }}
          >
            For Gift Senders
          </Typography>
          <Grid container spacing={3}>
            {HOW_IT_WORKS_SENDER.map((item) => (
              <Grid key={item.step} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: 'secondary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon icon={item.icon} width={32} style={{ color: theme.palette.secondary.main }} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'primary.main', fontWeight: 700 }}
                    >
                      Step {item.step}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 8 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Features
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Everything you need, nothing you don&apos;t
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {FEATURES.map((feature) => (
              <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    p: 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.secondary.lighter} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      <Icon icon={feature.icon} width={28} style={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 8 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Stories
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Loved by families
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid key={t.name} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    p: 1,
                    borderTop: `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <CardContent>
                    <Icon
                      icon="solar:quote-up-square-bold"
                      width={32}
                      style={{ color: theme.palette.primary.lighter, marginBottom: 16 }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3, fontStyle: 'italic' }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2">{t.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {t.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #8a4a8d 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={3} alignItems="center">
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Ready to welcome your baby with love?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
              Create your baby fund in under a minute. Share the link.
              Let your community show up for you.
            </Typography>
            <Button
              size="large"
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Get Started — It&apos;s Free
            </Button>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              No subscription. No hidden fees. Only 1.5% on each gift.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ py: 5, bgcolor: theme.palette.grey[900], color: 'white' }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Logo
                isSingle={false}
                sx={{
                  mb: 2,
                  '& svg path': { fill: 'white' },
                }}
              />
              <Typography variant="body2" sx={{ color: 'grey.500', maxWidth: 280, mt: 1 }}>
                The modern way Nigerian families celebrate new life — together.
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  sx={{ color: 'grey.500', cursor: 'pointer', '&:hover': { color: 'white' } }}
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  How It Works
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'grey.500', cursor: 'pointer', '&:hover': { color: 'white' } }}
                  onClick={handleGetStarted}
                >
                  Create a Fund
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  component="a"
                  href="/privacy-policy"
                  sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'white' } }}
                >
                  Privacy Policy
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href="/terms-and-conditions"
                  sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'white' } }}
                >
                  Terms & Conditions
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Connect
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                  }}
                >
                  <Icon icon="mdi:instagram" width={20} />
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                  }}
                >
                  <Icon icon="mdi:twitter" width={20} />
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                  }}
                >
                  <Icon icon="mdi:whatsapp" width={20} />
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Typography variant="body2" sx={{ color: 'grey.600', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} GidiNest. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
