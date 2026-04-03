import { useCallback } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme, type Theme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';

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
    <Box sx={{ overflow: 'hidden', bgcolor: '#faf9f7' }}>
      {/* Navbar */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: { xs: 2, md: 3 },
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(250,249,247,0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Logo isSingle={false} />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography
                variant="body2"
                onClick={handleSignIn}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Sign In
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGetStarted}
                sx={{ borderRadius: 6, px: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ─── Hero ─── */}
      <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                The modern way to{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 2,
                      left: 0,
                      width: '100%',
                      height: 6,
                      bgcolor: 'secondary.lighter',
                      borderRadius: 2,
                      zIndex: -1,
                    },
                  }}
                >
                  welcome
                </Box>{' '}
                a new baby in Nigeria
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  lineHeight: 1.7,
                  maxWidth: 520,
                  mb: 4,
                }}
              >
                GidiNest connects families, gift senders, and hospitals on one platform.
                Mothers create a baby fund, family and friends gift through a link, and funds
                go directly to verified hospitals or the mother&apos;s bank account.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleGetStarted}
                  sx={{
                    borderRadius: 6,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  Create a baby fund
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    document.getElementById('for-hospitals')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    borderRadius: 6,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  For Hospitals
                </Button>
              </Stack>
            </Grid>

            {/* Fund preview mockup */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 4,
                  p: 3,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.5,
                    }}
                  >
                    <Icon icon="solar:heart-bold" width={28} style={{ color: '#fff' }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Baby Adaeze&apos;s Fund
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    by Chioma & Emeka
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      ₦847,500 raised
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      ₦1,000,000
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100' }}>
                    <Box
                      sx={{
                        height: '100%',
                        width: '85%',
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }}
                    />
                  </Box>
                </Box>

                <Stack spacing={1.5}>
                  {[
                    { name: 'Aunty Nkem', amount: '₦50,000', time: '2 hours ago' },
                    { name: 'Uncle Tunde (London)', amount: '£80', time: '5 hours ago' },
                    { name: 'The Okafor Family', amount: '₦100,000', time: 'Yesterday' },
                  ].map((gift) => (
                    <Stack
                      key={gift.name}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ py: 1.5, px: 2, borderRadius: 2, bgcolor: '#faf9f7' }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'primary.lighter',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'primary.main',
                          }}
                        >
                          {gift.name[0]}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {gift.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {gift.time}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {gift.amount}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── Who it's for ─── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: { xs: 4, md: 6 },
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Who is GidiNest for?
          </Typography>

          <Grid container spacing={3}>
            {/* Mothers */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#faf9f7',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Expecting mothers
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Sign up in seconds — no paperwork',
                    'Create a baby fund on one screen',
                    'Share the link on WhatsApp, IG, anywhere',
                    'Get notified when gifts land',
                    'Withdraw to your bank or pay a hospital directly',
                  ].map((text) => (
                    <Stack key={text} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Gift Senders */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#faf9f7',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Family & friends
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Open the fund link — no sign-up needed',
                    'See progress, the target, mum\'s message',
                    'Pay with card, bank transfer, or USSD',
                    'Diaspora? Gift in GBP, USD, or CAD',
                    'Get an instant receipt when your gift lands',
                  ].map((text) => (
                    <Stack key={text} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'secondary.main', mt: 1, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Hospitals */}
            <Grid id="for-hospitals" size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#faf9f7',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Hospitals
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Get listed as a verified disbursement destination',
                    'Receive payments directly from mothers\' fund balances',
                    'Track referrals and see analytics',
                    'Priority placement for mothers in your area',
                    'Built on the Tiny Hearts network (500+ hospitals)',
                  ].map((text) => (
                    <Stack key={text} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'info.main', mt: 1, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── "You know this story" ─── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#faf9f7' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 1, textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            You know this story.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', textAlign: 'center', mb: 5, maxWidth: 500, mx: 'auto' }}
          >
            Somebody just had a baby. The WhatsApp group is buzzing. And then...
          </Typography>

          <Stack spacing={2} sx={{ maxWidth: 440, mx: 'auto' }}>
            <ChatBubble align="right" color={theme.palette.success.lighter}>
              Congrats mama!! What&apos;s your account number? I want to send something for baby
            </ChatBubble>
            <ChatBubble align="left" color={theme.palette.grey[100]}>
              Thank you!! 0123456789 GTBank. Use reference PL-BABY-042
            </ChatBubble>
            <ChatBubble align="right" color={theme.palette.success.lighter}>
              Sent! Check now
            </ChatBubble>
            <ChatBubble align="left" color={theme.palette.grey[100]}>
              I haven&apos;t seen it oh. Can you send receipt?
            </ChatBubble>
            <ChatBubble align="right" color={theme.palette.success.lighter}>
              Let me check with my bank...
            </ChatBubble>
          </Stack>

          <Stack alignItems="center" sx={{ mt: 5 }}>
            <Typography
              variant="body2"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 6,
                px: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              With GidiNest, it&apos;s just a link. No account numbers. No receipts to chase.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ─── The money flow ─── */}
      <Box id="how-it-works" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            How the money moves
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', textAlign: 'center', mb: 6, maxWidth: 480, mx: 'auto' }}
          >
            From gift to hospital bill — every naira is tracked, every fee is transparent.
          </Typography>

          <Stack spacing={0}>
            <StepRow
              number="1"
              title="Gift comes in"
              description="Someone opens your fund link and pays via Paystack. Card, bank transfer, USSD — whatever works for them. GidiNest takes 1.5% and credits your balance instantly."
              theme={theme}
            />
            <StepConnector />
            <StepRow
              number="2"
              title="Gifts stack up"
              description="Every gift is logged — who sent it, how much, when. You see it all in your dashboard. The fund page updates in real time so your community can see the progress."
              theme={theme}
            />
            <StepConnector />
            <StepRow
              number="3"
              title="You withdraw when ready"
              description="Send funds to your personal bank account, or pay a verified GidiNest hospital directly for delivery, antenatal, or postnatal care. A 1% disbursement fee applies on withdrawal. That's it."
              theme={theme}
            />
          </Stack>
        </Container>
      </Box>

      {/* ─── Diaspora ─── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#faf9f7' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Family abroad? They&apos;re covered.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
                Nigerians in the UK, US, and Canada can gift in GBP, USD, or CAD.
                No more asking someone to &ldquo;help me convert and send&rdquo;. No more
                parallel market rate confusion.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                Diaspora members can also subscribe for premium features — higher transfer limits,
                gift scheduling, and the ability to co-manage a family fund with the mother
                from anywhere in the world.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  p: 3.5,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.disabled', mb: 2, display: 'block' }}>
                  Diaspora Premium
                </Typography>
                <Stack spacing={2.5}>
                  {[
                    { icon: 'solar:dollar-bold', label: 'Gift in GBP, USD, or CAD' },
                    { icon: 'solar:calendar-bold', label: 'Schedule gifts for due dates' },
                    { icon: 'solar:users-group-rounded-bold', label: 'Co-manage family funds remotely' },
                    { icon: 'solar:arrow-up-bold', label: 'Higher transfer limits' },
                  ].map((item) => (
                    <Stack key={item.label} direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          bgcolor: 'primary.lighter',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon icon={item.icon} width={20} style={{ color: theme.palette.primary.main }} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider sx={{ my: 2.5 }} />
                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>$9.99</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>/month</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── Hospital B2B ─── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                {[
                  {
                    tier: 'Basic',
                    price: '₦50,000/mo',
                    features: 'Listed as verified hospital + referral tracking',
                    color: theme.palette.grey[700],
                  },
                  {
                    tier: 'Pro',
                    price: '₦150,000/mo',
                    features: 'Priority listing in mother\'s area + analytics dashboard',
                    color: theme.palette.primary.main,
                  },
                  {
                    tier: 'Enterprise',
                    price: '₦500,000/mo',
                    features: 'Co-branded experience + API access for direct integration',
                    color: theme.palette.secondary.main,
                  },
                ].map((plan) => (
                  <Box
                    key={plan.tier}
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      bgcolor: '#faf9f7',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: plan.color }}>
                        {plan.tier}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {plan.price}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {plan.features}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Hospitals: get paid directly by the families you serve
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
                When a mother on GidiNest is ready to pay for delivery, antenatal, or postnatal
                care — she can disburse directly to your hospital from her fund balance.
                No invoicing. No follow-ups. The money moves through Paystack.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                Get listed on GidiNest to become a recommended disbursement destination
                for every mother in your area. Built on the Tiny Hearts network — 500+
                hospitals already in the pipeline.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── Fees transparency ─── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#faf9f7' }}>
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Simple, transparent pricing
          </Typography>

          <Stack spacing={2}>
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2.5,
                p: 3,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Gifting fee
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Deducted when a gift is received
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  1.5%
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2.5,
                p: 3,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Withdrawal fee
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    When you transfer to bank or hospital
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  1%
                </Typography>
              </Stack>
            </Box>

            <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center', pt: 1 }}>
              No subscriptions for mothers. No signup fees. No hidden charges.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ─── CTA ─── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          bgcolor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Your village is ready. Give them a link.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, mb: 4, lineHeight: 1.7 }}>
            Create your baby fund in 30 seconds. Share it with family and friends.
            Watch the love come in — and send it where it matters most.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              size="large"
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                borderRadius: 6,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Start a baby fund
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => {
                document.getElementById('for-hospitals')?.scrollIntoView({ behavior: 'smooth' });
              }}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'white',
                borderRadius: 6,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              List your hospital
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ─── Footer ─── */}
      <Box
        component="footer"
        sx={{ py: 4, bgcolor: theme.palette.grey[900], color: 'white' }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Logo
                isSingle={false}
                sx={{ '& svg path': { fill: 'white' } }}
              />
              <Typography variant="caption" sx={{ color: 'grey.500' }}>
                &copy; {new Date().getFullYear()} GidiNest. All rights reserved.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center">
              <Typography
                variant="caption"
                component="a"
                href="/privacy-policy"
                sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                Privacy
              </Typography>
              <Typography
                variant="caption"
                component="a"
                href="/terms-and-conditions"
                sx={{ color: 'grey.500', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                Terms
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
              <Stack direction="row" spacing={1}>
                <SocialIcon icon="mdi:instagram" />
                <SocialIcon icon="ri:twitter-x-fill" />
                <SocialIcon icon="mdi:whatsapp" />
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function ChatBubble({
  children,
  align,
  color,
}: {
  children: React.ReactNode;
  align: 'left' | 'right';
  color: string;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <Box
        sx={{
          bgcolor: color,
          px: 2,
          py: 1.5,
          borderRadius: 2.5,
          borderTopRightRadius: align === 'right' ? 4 : 16,
          borderTopLeftRadius: align === 'left' ? 4 : 16,
          maxWidth: '80%',
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}

function StepRow({
  number,
  title,
  description,
  theme,
}: {
  number: string;
  title: string;
  description: string;
  theme: Theme;
}) {
  return (
    <Stack direction="row" spacing={2.5} alignItems="flex-start" sx={{ px: { xs: 0, md: 1 } }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
          mt: 0.3,
        }}
      >
        {number}
      </Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

function StepConnector() {
  return (
    <Box sx={{ pl: { xs: 2.5, md: 3.5 }, py: 0 }}>
      <Box sx={{ width: 2, height: 32, bgcolor: 'grey.300', ml: '11px' }} />
    </Box>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
      }}
    >
      <Icon icon={icon} width={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
    </Box>
  );
}
