import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert'; // Added for error display
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress'; // Added for loading indicator

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// Assuming you have a type for comments
interface IComment {
  id: string;
  author: {
    name: string;
    avatar: string; // URL to avatar image
  };
  content: string;
  createdAt: string; // Date string or Date object
}

// Reusing IPostItem from your previous component for the main post
// Make sure IPostItem is correctly defined and available in this scope.
// For example:
// interface IPostItem {
//   id: string;
//   title: string;
//   author: { name: string }; // Assuming author is just a name here from IPostItem
//   postedAt: string; // Assuming IPostItem has a postedAt field
//   coverUrl: string; // Just an example, from original PostItem
// }
import type { IPostItem } from '../post-item';


// Extended type for a single community post to include comments and views
interface ICommunityPostDetail extends IPostItem {
  description: string; // Detailed description of the post
  comments: IComment[];
  viewCount: number;
}


export function CommunityPostDetailView() {
  const [newComment, setNewComment] = useState('');
  const { id } = useParams<{ id: string }>(); // Specify type for useParams
  const [post, setPost] = useState<ICommunityPostDetail | null>(null); // Type post state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Type error state

  useEffect(() => {
    // const fetchPost = async () => {
    //   if (!id) { // Ensure ID exists before fetching
    //     setLoading(false);
    //     setError(new Error('Post ID is missing from URL.'));
    //     return;
    //   }
    //   try {
    //     setLoading(true);
    //     setError(null); // Clear previous errors
    //     // Replace with your actual API call
    //     const response = await fetch(`/api/community/posts/${id}`);
    //     if (!response.ok) {
    //       const errorData = await response.json(); // Try to get more specific error
    //       throw new Error(errorData.message || `Failed to fetch post (Status: ${response.status})`);
    //     }
    //     const data: ICommunityPostDetail = await response.json();
    //     setPost(data);
    //   } catch (err) {
    //     if (err instanceof Error) {
    //       setError(err);
    //     } else {
    //       setError(new Error('An unknown error occurred.'));
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchPost();

 
    const data: ICommunityPostDetail = {
      "id": "comm_post_001",
      "title": "Best Places to Find Authentic Nigerian Street Food in Lagos",
      "description": "Hey GidiNest Community! 👋 I'm a huge fan of street food and always on the lookout for the best spots in Lagos. What are your go-to places for delicious, authentic Nigerian street food? Thinking about things like Suya, Akara, Ewa Agoyin, Boli, and more! Share your hidden gems and tips on what makes them special. Let's build a guide together!",
      "author": {
        "name": "FoodieExplorerNG",
        "avatarUrl": "/assets/images/avatars/avatar_1.jpg"
      },
      "postedAt": "2025-07-16T14:30:00Z",
      "coverUrl": "/assets/images/cover/community_food_lagos.jpg",
      "viewCount": 1258,
      "comments": [
        {
          "id": "comment_01",
          "author": {
            "name": "LagosEats",
            "avatar": "/assets/images/avatars/avatar_2.jpg"
          },
          "content": "You HAVE to check out the Suya stand at Glover Road, Ikoyi, opposite the old Park 'n' Shop. Their beef suya is out of this world! 🔥 Always fresh and perfectly spiced.",
          "createdAt": "2025-07-16T15:05:00Z"
        },
        {
          "id": "comment_02",
          "author": {
            "name": "MamaBolaFan",
            "avatar": "/assets/images/avatars/avatar_3.jpg"
          },
          "content": "For Ewa Agoyin, nothing beats Mama Bola's spot in Surulere. It's a small shack, but the beans are cooked perfectly soft, and the sauce is divine. She's usually there from 8 AM to 2 PM.",
          "createdAt": "2025-07-16T16:10:00Z"
        },
        {
          "id": "comment_03",
          "author": {
            "name": "GrillMaster",
            "avatar": "/assets/images/avatars/avatar_4.jpg"
          },
          "content": "If you're in Lekki, the Boli and Groundnut seller near Spar is amazing. The plantain is always ripe and grilled to perfection. Don't forget to grab some roasted fish too!",
          "createdAt": "2025-07-16T18:45:00Z"
        },
        {
          "id": "comment_04",
          "author": {
            "name": "JustATourist",
            "avatar": "/assets/images/avatars/avatar_5.jpg"
          },
          "content": "Are there any good spots around Victoria Island for first-timers? Looking for something safe and delicious!",
          "createdAt": "2025-07-17T09:00:00Z"
        }
      ],
      totalViews: 0,
      totalShares: 0,
      totalComments: 0,
      totalFavorites: 0
    }; 
    setPost(data);
    setLoading(false);

  }, [id]); // Dependency array: re-run effect if ID changes

  const handleAddComment = useCallback(() => {
    if (newComment.trim() && post) { // Ensure post exists before adding comment
      // In a real application, you'd send this to an API
      console.log(`Adding new comment to post ${post.id}:`, newComment);
      // Optimistically update UI or re-fetch comments after successful API call
      // For now, just clear the input:
      setNewComment('');

      // Example of optimistic update (for demonstration, remove in real app if re-fetching):
      // const tempId = Date.now().toString(); // Temporary ID
      // const tempComment: IComment = {
      //   id: tempId,
      //   author: { name: "Current User", avatar: "/path/to/current-user-avatar.jpg" }, // Replace with actual user info
      //   content: newComment.trim(),
      //   createdAt: new Date().toISOString(),
      // };
      // setPost((prevPost) =>
      //   prevPost ? { ...prevPost, comments: [...prevPost.comments, tempComment] } : prevPost
      // );
    }
  }, [newComment, post]); // Add post to dependency array

  // --- Render Logic for Loading, Error, and Not Found States ---
  if (loading) {
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
          <Typography variant="h6">Error loading post:</Typography>
          <Typography>{error.message}</Typography>
        </Alert>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Try Again</Button>
      </DashboardContent>
    );
  }

  if (!post) { // If loading is false and no error, but post is null (e.g., 404 from API)
    return (
      <DashboardContent>
        <Alert severity="warning">
          <Typography variant="h6">Post not found.</Typography>
          <Typography>The community discussion you are looking for does not exist.</Typography>
        </Alert>
        <Button href="/community" sx={{ mt: 2 }}>Back to Community</Button>
      </DashboardContent>
    );
  }

  // --- Main Content Render (only if post is successfully loaded) ---
  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
          By {post.author.name} | {post.postedAt}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:eye-bold" width={20} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {post.viewCount} views
            </Typography>
          </Stack>

          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="solar:share-bold" />}
            onClick={() => {
              // Share functionality: e.g., using Web Share API
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.description.substring(0, 100) + '...', // Short preview
                  url: window.location.href,
                }).then(() => console.log('Successful share'))
                  .catch((error_) => console.log('Error sharing', error_));
              } else {
                // Fallback for browsers that don't support Web Share API
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
          {post.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Comments Section */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Comments ({post.comments?.length || 0}) {/* Use optional chaining for safety */}
        </Typography>

        <Stack spacing={3} sx={{ mb: 5 }}>
          {post.comments && post.comments.length > 0 ? ( // Check if comments exist and are not empty
            post.comments.map((comment) => (
              <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                <Avatar src={comment.author.avatar} alt={comment.author.name} />
                <Card sx={{ flexGrow: 1, bgcolor: 'background.neutral' }}>
                  <CardContent sx={{ pb: '16px !important' }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle2">
                        {comment.author.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {comment.createdAt}
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
        </Stack>

        {/* Add New Comment Section */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar alt="Current User" src="/assets/images/avatars/avatar_default.jpg" /> {/* Replace with actual user avatar source */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            sx={{ flexShrink: 0, height: 56 }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </DashboardContent>
  );
}