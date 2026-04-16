// Manual Instagram posts configuration
// Add your Instagram posts here with their details
// You can get this information from your Instagram posts

export interface ManualInstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  permalink: string;
  topComments: {
    username: string;
    text: string;
    likes: number;
  }[];
}

export const manualInstagramPosts: ManualInstagramPost[] = [
  // Add your Instagram posts here
  // To get post details:
  // 1. Go to your Instagram post
  // 2. Right-click on the image and copy image URL or save the image to public/img/assts/
  // 3. Copy the post caption
  // 4. Note the likes and comments count
  // 5. Copy the post URL (permalink)
  // 6. Add top comments manually
  
  // Example format:
  // {
  //   id: "unique-id-1",
  //   imageUrl: "/img/assts/your-image.jpg", // Path to image in public folder
  //   caption: "Your Instagram post caption here",
  //   likes: 1250,
  //   comments: 89,
  //   timestamp: "2 days ago", // or "1 week ago", "3 hours ago", etc.
  //   permalink: "https://www.instagram.com/p/YOUR_POST_ID/", // Full Instagram post URL
  //   topComments: [
  //     { username: "username1", text: "Great post! Love it!", likes: 45 },
  //     { username: "username2", text: "Amazing results! 💫", likes: 32 },
  //   ],
  // },
];

