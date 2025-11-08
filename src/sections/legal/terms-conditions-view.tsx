import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Alert, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export function TermsConditionsView() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Terms and Conditions
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
            Our Terms and Conditions are available as a PDF document. Click the button below to view or download it.
          </Typography>
        </Alert>

        <Button
          variant="contained"
          color="primary"
          href="/GidiNest_Terms_and_Conditions.pdf"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          View Terms and Conditions PDF
        </Button>
      </Box>

      <Box
        component="iframe"
        src="/GidiNest_Terms_and_Conditions.pdf"
        sx={{
          width: '100%',
          height: '80vh',
          border: 'none',
          borderRadius: 2,
          boxShadow: 2,
        }}
        title="Terms and Conditions"
      />
    </Container>
  );
}

