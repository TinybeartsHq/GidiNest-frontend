import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { RouterLink } from 'src/routes/components'; // Assuming this path

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// Repurposing PostItem for CommunityPostItem or similar
import { PostItem } from '../post-item'; // Will function as CommunityPostItem
import { PostSort } from '../post-sort'; // Will function as CommunitySort
import { PostSearch } from '../post-search'; // Will function as CommunitySearch

// Reusing IPostItem type, but conceptually it represents ICommunityPostItem
import type { IPostItem } from '../post-item';


type Props = {
  communityPosts: IPostItem[]; // Renamed 'posts' to 'communityPosts' for clarity
};

export function CommunityView({ communityPosts }: Props) { // Renamed BlogView to CommunityView
  const [sortBy, setSortBy] = useState('latest'); // Sorting can be for 'latest discussions', 'most active', etc.

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          GidiNest Community Forum 🤝
        </Typography>
        <Button
          variant="contained"
          color="primary" // Changed color for visual distinction
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Start New Discussion
        </Button>
      </Box>

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Repurposing PostSearch for community search */}
        <PostSearch posts={communityPosts} />
        {/* Repurposing PostSort for community sort */}
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest Discussions' }, // Relevant community sort option
            { value: 'popular', label: 'Most Active' }, // Relevant community sort option
            { value: 'oldest', label: 'Oldest Discussions' }, // Relevant community sort option
          ]}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Map through communityPosts, repurposing PostItem for community discussions/tips */}
        {communityPosts.map((post, index) => {
          // Keep the existing layout logic if it's visually appealing for community posts
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid
              key={post.id}
              size={{
                xs: 12,
                sm: latestPostLarge ? 12 : 6,
                md: latestPostLarge ? 6 : 3,
              }}
            >
              <Box
                component={RouterLink}
                href={`/community/${post.id}`} // <--- This is the key: Link to the detail page
                sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
              {/* PostItem component will now display community post content */}
              <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}