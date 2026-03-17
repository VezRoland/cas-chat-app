import { User } from '../auth/user.model';

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
