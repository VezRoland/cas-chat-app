import { User } from '../auth/user.model';

export type ListUser = Pick<User, 'id' | 'username' | 'profilePicture' | 'createdAt'>;

export interface NewConversationBody {
  title: string;
  isPublic?: boolean;
  password?: string;
  participants: string[];
}

export type NewConversationResponse = Pick<Conversation, 'id' | 'title' | 'isPublic' | 'createdAt'>;

export interface Conversation {
  id: string;
  createdAt: Date;
  title: string;
  isPublic: boolean;
  _count: {
    messages: number;
    users: number;
  };
}

export type ListConversation = Pick<Conversation, 'id' | 'title' | 'createdAt' | '_count'>;

export interface ConversationPreview {
  id: string;
  title: string;
  messages: ConversationPreviewLastMessage[];
}

interface ConversationPreviewLastMessage {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    profilePicture: string;
  };
}

export interface ConversationMessage {
  id: string;
  content: string;
  user: Pick<User, 'id' | 'username' | 'profilePicture'>;
  createdAt: Date;
  editedAt: Date;
}

export interface ConversationUser {
  id: string;
  username: string;
  nickname: string;
  isOwner: boolean;
  createdAt: Date;
}
