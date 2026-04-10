import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { WS_URL } from '../api/config';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';

export const useLikesWebSocket = () => {
  const stompClient = useRef(null);
  const { posts } = usePostsStore();
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token || posts.length === 0) return;

    // We initialize SockJS and STOMP client
    const socket = new SockJS(`${WS_URL}?token=${token}`);
    
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket for real-time likes');
        
        // Subscribe to each post in our feed
        posts.forEach(post => {
          stompClient.current.subscribe(`/topic/likes/${post.id}`, (message) => {
            if (message.body) {
              const notification = JSON.parse(message.body);
              // Optimistic local state update in postsStore
              usePostsStore.setState((state) => ({
                posts: state.posts.map(p => 
                  p.id === notification.postId 
                    ? { ...p, likesCount: notification.totalLikes }
                    : p
                )
              }));
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [posts.length, isAuthenticated, token]); // Re-connect if posts list length changes significantly or auth state changes
};
