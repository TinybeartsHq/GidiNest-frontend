import React, { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { DashboardContent } from 'src/layouts/dashboard';

 
const healthTipsData = [
  {
    id: 'tip_1_1',
    category: '1st Trimester Tips',
    title: 'FAQs: When can I hear the baby\'s heartbeat?',
    content: 'The baby\'s heartbeat can often be detected by a vaginal ultrasound as early as 6 weeks. With a doppler, it may be heard around 10-12 weeks, but this can vary.',
  },
  {
    id: 'tip_1_2',
    category: '1st Trimester Tips',
    title: 'When to visit the clinic',
    content: 'Your first prenatal visit is typically between weeks 8 and 10. Subsequent visits are usually scheduled every 4 weeks. Your doctor will provide a schedule tailored to your health.',
  },
  {
    id: 'tip_1_3',
    category: '1st Trimester Tips',
    title: 'Things to expect: Nausea and fatigue',
    content: 'Morning sickness and extreme fatigue are common in the first trimester due to hormonal changes. Eating small, frequent meals and getting enough rest can help manage these symptoms.',
  },
  {
    id: 'tip_1_4',
    category: '1st Trimester Tips',
    title: 'Essential Diet: Folic Acid and Iron',
    content: 'Folic acid is crucial for preventing birth defects of the baby\'s brain and spine. Make sure you are taking a prenatal vitamin with at least 400 mcg of folic acid daily. Iron is also vital to prevent anemia.',
  },
  {
    id: 'tip_1_5',
    category: '1st Trimester Tips',
    title: 'What foods to avoid',
    content: 'To reduce the risk of foodborne illnesses, avoid unpasteurized dairy products, deli meats, raw seafood, and fish high in mercury like swordfish and shark. Thoroughly wash all fruits and vegetables.',
  },
  {
    id: 'tip_1_6',
    category: '1st Trimester Tips',
    title: 'Antenatal Visits: What to expect',
    content: 'Your first visit will likely include a full medical history, a physical exam, blood and urine tests, and a dating scan to confirm your due date. Feel free to bring a list of questions for your doctor.',
  },

  {
    id: 'tip_2_1',
    category: '2nd Trimester Tips',
    title: 'What exercises are safe?',
    content: 'Activities like walking, swimming, prenatal yoga, and cycling on a stationary bike are generally safe. Avoid high-impact sports and any exercises that require you to lie flat on your back for prolonged periods after the first trimester.',
  },
  {
    id: 'tip_2_2',
    category: '2nd Trimester Tips',
    title: 'Diet plans for the second trimester',
    content: 'Focus on a balanced diet rich in iron, calcium, and protein. Leafy greens, lean meats, and dairy are excellent choices. Stay hydrated and continue taking your prenatal vitamins.',
  },
  {
    id: 'tip_2_3',
    category: '2nd Trimester Tips',
    title: 'Questions to ask in antenatal visits',
    content: 'Ask about any discomfort you\'re experiencing, fetal movement, upcoming tests like the glucose screening, and your birth plan options. This is a great time to discuss your baby\'s gender if you wish to find out!',
  },
  {
    id: 'tip_2_4',
    category: '2nd Trimester Tips',
    title: 'FAQs: When will I feel the baby move?',
    content: 'You may start to feel the baby\'s first movements, known as "quickening," between weeks 16 and 25. It often feels like fluttering, gas bubbles, or light tapping. Don\'t worry if it takes a while!',
  },
  {
    id: 'tip_2_5',
    category: '2nd Trimester Tips',
    title: 'The importance of an anatomy scan',
    content: 'Around week 20, you\'ll have an anatomy scan to check the baby\'s growth, development, and to screen for any potential issues. This is also when the baby\'s gender can often be determined accurately.',
  },

  {
    id: 'tip_3_1',
    category: '3rd Trimester Tips',
    title: 'FAQs: What\'s the difference between Braxton Hicks and real contractions?',
    content: 'Braxton Hicks contractions are irregular and typically don\'t get stronger or closer together. Real contractions become more frequent, last longer, and feel more intense over time.',
  },
  {
    id: 'tip_3_2',
    category: '3rd Trimester Tips',
    title: 'Immunization plans during pregnancy',
    content: 'Your doctor may recommend a Tdap (tetanus, diphtheria, and pertussis) vaccine in your third trimester. This protects your newborn from whooping cough.',
  },
  {
    id: 'tip_3_3',
    category: '3rd Trimester Tips',
    title: 'Preparing for labor and delivery',
    content: 'Pack your hospital bag, discuss your birth plan with your partner and doctor, and attend a childbirth class. Learn the signs of labor and when to call your clinic or head to the hospital.',
  },
  {
    id: 'tip_3_4',
    category: '3rd Trimester Tips',
    title: 'Recognizing the signs of labor',
    content: 'Look for signs like regular contractions that increase in frequency and intensity, your water breaking (a gush or trickle of fluid), or bloody show (a mucus discharge with a small amount of blood).',
  },
  {
    id: 'tip_3_5',
    category: '3rd Trimester Tips',
    title: 'What to pack in your hospital bag',
    content: 'For you: ID, birth plan, comfortable clothes, toiletries, snacks. For baby: a few outfits, swaddles, mittens, socks, and a car seat already installed in your car. For your partner: snacks, a change of clothes, and phone chargers.',
  },
  {
    id: 'tip_4_1',
    category: 'Post-Natal Tips',
    title: 'FAQs: How do I manage postpartum blues?',
    content: 'It\'s normal to feel emotional after childbirth. Rest, accept help from friends and family, and talk to your partner. If feelings of sadness or anxiety persist for more than two weeks, contact your doctor as it could be postpartum depression.',
  },
  {
    id: 'tip_4_2',
    category: 'Post-Natal Tips',
    title: 'Post-natal recovery exercises',
    content: 'Start with gentle exercises like walking and pelvic floor exercises (Kegels). Consult your doctor before beginning a more vigorous routine, typically around 6 weeks postpartum.',
  },
  {
    id: 'tip_4_3',
    category: 'Post-Natal Tips',
    title: 'Breastfeeding support and diet',
    content: 'Ensure you are consuming a nutritious diet and staying hydrated. If you face challenges with breastfeeding, seek help from a lactation consultant or a support group.',
  },
  {
    id: 'tip_4_4',
    category: 'Post-Natal Tips',
    title: 'C-section recovery tips',
    content: 'Keep your incision clean and dry, take pain medication as prescribed, and avoid heavy lifting. Walk gently to promote healing and circulation. Contact your doctor if you notice any signs of infection.',
  },
  {
    id: 'tip_4_5',
    category: 'Post-Natal Tips',
    title: 'When is it safe to resume sex?',
    content: 'Most healthcare providers recommend waiting at least 4 to 6 weeks after giving birth to allow your body to heal and to reduce the risk of infection. Always follow your doctor\'s advice.',
  },
];

const categories = ['1st Trimester Tips', '2nd Trimester Tips', '3rd Trimester Tips', 'Post-Natal Tips'];


export function TipsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = useMemo(() => {
    if (!searchQuery) {
      return healthTipsData;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return healthTipsData.filter(
      (tip) =>
        tip.title.toLowerCase().includes(lowerCaseQuery) ||
        tip.content.toLowerCase().includes(lowerCaseQuery) ||
        tip.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Health Tips & FAQs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Find answers to common questions and get health tips for every stage of your journey.
        </Typography>
        <TextField
          fullWidth
          label="Search for tips or FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 5, maxWidth: 'md' }}
        />
      </Box>

      <Grid container spacing={4}>
        {categories.map((category) => {
          const categoryTips = filteredTips.filter((tip) => tip.category === category);

          if (categoryTips.length === 0) {
            return null;
          }

          return (
            <Grid key={category} size={{ xs: 12 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {category}
              </Typography>
              <Card component={Paper} elevation={1} sx={{ p: 2 }}>
                {categoryTips.map((tip) => (
                  <Accordion key={tip.id} sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{tip.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {tip.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredTips.length === 0 && searchQuery && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>No Results Found</AlertTitle>
          <Typography>There are no tips or FAQs matching your search for &rdquo;{searchQuery}&rdquo;.</Typography>
        </Alert>
      )}

    </DashboardContent>
  );
}