import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { useState, useEffect, useCallback } from 'react'; // Import useEffect

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert'; // For error messages
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import AlertTitle from '@mui/material/AlertTitle'; // For error messages
import CircularProgress from '@mui/material/CircularProgress'; // For loading indicator

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// Repurposing PostItem for CommunityPostItem or similar
import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';
// Import Redux actions and types
import {
  fetchCommunityFeed,
  clearCommunityError,
} from '../../../redux/community/community.actions';

// Reusing IPostItem type, but conceptually it represents ICommunityPostItem
// Make sure this type is compatible with your Post interface in the reducer
import type {AppDispatch } from '../../../redux/types'; // Assuming AppDispatch and AppState are here
import type { Post as CommunityPostType } from '../../../redux/community/community.reducer'; // Import the Post type from your reducer

// Note: If IPostItem and CommunityPostType from your reducer are different,
// you will need to map or align them. For now, assuming IPostItem can hold
// the data structure of CommunityPostType. If not, consider creating a specific
// interface for community posts, e.g., ICommunityPostItem, that matches your Redux Post type.

// Remove Props type as communityPosts will come from Redux
// type Props = {
//   communityPosts: IPostItem[];
// };

export function CommunityView() { // Removed communityPosts prop
  const dispatch: AppDispatch = useDispatch();
  // Select community feed data, loading, and error states from Redux store
  const { feed: communityPosts, loading, error } = useSelector((state:any) => state.community);

  console.log(communityPosts)
  const [sortBy, setSortBy] = useState('latest');

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
    // You might want to re-fetch or re-sort the 'communityPosts' based on 'newSort' here
    // If sorting happens on the backend, dispatch fetchCommunityFeed with a sort parameter
  }, []);

  // Effect to fetch community feed when the component mounts
  useEffect(() => {
    dispatch(fetchCommunityFeed());
  }, [dispatch]); // Dependency array ensures it runs only once on mount

  // Effect to clear errors after a delay
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCommunityError());
      }, 5000); // Clear error message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Handle loading state
  if (loading && communityPosts.length === 0) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h5" sx={{ mt: 2 }}>Loading community discussions...</Typography>
        </Box>
      </DashboardContent>
    );
  }

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
        Community Forum 🤝
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          // You might want to add an onClick handler here to navigate to a "Create New Post" page or open a modal
          // For now, let's just make it a link:
          component={RouterLink}
          href="/community/new-post" // Assuming a route for creating new posts
        >
          Create a post
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Repurposing PostSearch for community search */}
        {/* Note: PostSearch currently takes `posts` prop. If it needs to trigger API search,
            its implementation needs to change. For now, it will only search current `communityPosts`. */}
        <PostSearch posts={communityPosts} />
        {/* Repurposing PostSort for community sort */}
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest Discussions' },
            { value: 'popular', label: 'Most Active' },
            { value: 'oldest', label: 'Oldest Discussions' },
          ]}
        />
      </Box>

      <Grid container spacing={3}>
        {communityPosts.length === 0 && !loading ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              No discussions found. Be the first to start one!
            </Alert>
          </Grid>
        ) : (
          communityPosts.map((post: CommunityPostType, index: number) => { // Type cast post for safety
            const latestPostLarge = index === 0;
            const latestPost = index === 1 || index === 2;

            return (
              <Grid
                key={post.id}
                size={{
                  xs: 12,
                  sm: latestPostLarge ? 12 : 6,
                  md: latestPostLarge ? 4 : 4, // Adjusted md to 4 for a 3-column layout after the large post
                }}
              >
                <Box
                  component={RouterLink}
                  href={`/community/${post.id}`}
                  sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
                </Box>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* You might want to connect Pagination to your API's pagination logic */}
      <Pagination count={1} color="primary" sx={{ mt: 8, mx: 'auto' }} /> {/* Default to 1 if no backend pagination */}
    </DashboardContent>
  );
}