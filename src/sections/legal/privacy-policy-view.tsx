import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Alert, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export function PrivacyPolicyView() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Privacy Policy
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.neutral',
        }}
      >
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Our Privacy Policy is available as a PDF document. Click the button below to view or download it.
          </Typography>
        </Alert>

        <Button
          variant="contained"
          color="primary"
          href="/GidiNest_Privacy_Policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          View Privacy Policy PDF
        </Button>
      </Box>

      <Box
        component="iframe"
        src="/GidiNest_Privacy_Policy.pdf"
        sx={{
          width: '100%',
          height: '80vh',
          border: 'none',
          borderRadius: 2,
          boxShadow: 2,
        }}
        title="Privacy Policy"
      />
    </Container>
  );
}

