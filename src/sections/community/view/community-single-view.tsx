import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle'; // Added for consistent error display
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// Import Redux actions and types
import {
  addComment,
  fetchSinglePost,
  clearCommunityError,
} from '../../../redux/community/community.actions';

import type { AppDispatch } from '../../../redux/types';
// Use your Redux Post type directly

// We can simplify the types here by using the Redux Post type directly,
// as it should now contain all necessary fields for display.
// If IPostItem from '../post-item' is still needed for other components, keep it.
// For this view, we'll primarily rely on `CommunityPostType`.

// Example of how you might map your reducer's Post type to a display type
// interface ICommunityPostDetailDisplay extends CommunityPostType {
//   // Any additional client-side computed properties if needed
// }


export function CommunityPostDetailView() {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  // Get selectedPost, loading, and error from Redux store
  const { selectedPost: post, loading, error } = useSelector((state:any) => state.community);

  // Assuming you have user information in your auth state for adding comments
  const currentUser = useSelector((state: any) => state.auth.user); // Get current user from auth state
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const [newCommentContent, setNewCommentContent] = useState(''); // Renamed for clarity

  // Effect to fetch single post when ID changes or component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchSinglePost(id));
    }
  }, [dispatch, id]);

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


  const handleAddComment = useCallback(async () => {
    if (!newCommentContent.trim() || !id || !isAuthenticated) {
      // Add more specific validation/alerts here if needed
      if (!isAuthenticated) alert('You must be logged in to comment.');
      else if (!newCommentContent.trim()) alert('Comment cannot be empty.');
      return;
    }
 
    // Dispatch the addComment action
    const result = await dispatch(addComment(id, {
      content: newCommentContent.trim(),
    }));

   
    if (result.success) {
      setNewCommentContent(''); // Clear the input field on success
      // The Redux reducer for ADD_COMMENT_SUCCESS will automatically update 'selectedPost.comments'
      // no need to manually update local state like `setPost`
      dispatch(fetchSinglePost(id));
    } else {
      // Error handling is managed by Redux state, which will display the Alert
      console.error('Failed to add comment:', result.error);
    }
  }, [newCommentContent, id, dispatch, isAuthenticated, currentUser?.id]);

  // --- Render Logic for Loading, Error, and Not Found States ---
  if (loading && !post) { // Show loading only if post is null (initial load)
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading post details...</Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Alert severity="error">
          <AlertTitle>Error loading post:</AlertTitle>
          <Typography>{error}</Typography> {/* error from redux is string */}
        </Alert>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Try Again</Button>
      </DashboardContent>
    );
  }

  if (!post) { // If loading is false and no error, but post is null (e.g., 404 from API)
    return (
      <DashboardContent>
        <Alert severity="warning">
          <AlertTitle>Post not found.</AlertTitle>
          <Typography>The community discussion you are looking for does not exist.</Typography>
        </Alert>
        <Button href="/community" sx={{ mt: 2 }}>Back to Community</Button>
      </DashboardContent>
    );
  }

  // Helper function to render a common info item
  const renderInfoItem = (value: string | number | undefined | null, icon: string, label: string) => (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {/* <Iconify icon={icon} width={20} /> */}
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {typeof value === 'number' ? value : (value || 0)} {label} {/* Handle undefined/null */}
      </Typography>
    </Stack>
  );

  // --- Main Content Render (only if post is successfully loaded) ---
  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
          By {post.author_first_name} | {new Date(post.created_at).toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          {/* {renderInfoItem(post.comments?.length, 'solar:chat-round-dots-bold', 'comments')} */}
          {renderInfoItem(post.likes?.length, 'solar:heart-bold', 'likes')} {/* Assuming 'likes' array exists */}

          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="solar:share-bold" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.content.substring(0, 100) + '...', // Use post.content
                  url: window.location.href,
                }).then(() => console.log('Successful share'))
                  .catch((error_) => console.log('Error sharing', error_));
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
          >
            Share
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ lineHeight: 1.75, mb: 4 }}>
          {post.content} {/* Use post.content for the main body */}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Comments Section */}
        {/* <Typography variant="h5" sx={{ mb: 3 }}>
          Comments ({post.comments?.length || 0})
        </Typography>

        <Stack spacing={3} sx={{ mb: 5 }}>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment:any) => (
              <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                <Avatar src="/assets/images/avatars/avatar_default.jpg" alt={comment.author_first_name} />  
                <Card sx={{ flexGrow: 1, bgcolor: 'background.neutral' }}>
                  <CardContent sx={{ pb: '16px !important' }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle2">
                        {comment.author_first_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              No comments yet. Be the first to start a discussion!
            </Typography>
          )}
        </Stack> */}

        {/* Add New Comment Section */}
     
        {/* <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar  src="/assets/images/avatars/avatar_default.jpg" />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            variant="outlined"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            disabled={loading} // Disable input while adding comment
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            disabled={!newCommentContent.trim() || loading}
            sx={{ flexShrink: 0, height: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </Box> */}
       
      </Box>
    </DashboardContent>
  );
}