import type {
  GetAllPropertyRecordCards,
  GetAllUserRecordCards,
  GetAllReportRequestRecordCards,
  GetAllReportRecordCards,
  GetAllConversationCards,
  GetAllConversationMessageCards,
} from "@/api/types";
import type { User } from "@/types/user";

interface BaseState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: Error | null;
}

// Auth state types
interface AuthState extends BaseState {
  user: {
    access: string | null;
    refresh: string | null;
    username?: string;
  };
  isAuthenticated: boolean;
}

// Property state types
interface PropertyState extends BaseState {
  data: GetAllPropertyRecordCards;
  dataFetched: boolean;
}
interface ReportState extends BaseState {
  data: GetAllReportRecordCards;
}

// Report state types
interface ReportRequestPollingState {
  activePollingId: number | null;
  pollingStartTime: number | null;
  pollingIntervalId: number | null;
}
interface ReportRequestState extends BaseState {
  data: GetAllReportRequestRecordCards;
  polling: ReportRequestPollingState;
}

// User state types
interface UserState extends BaseState {
  users: GetAllUserRecordCards;
  profile: User;
  passwordResetStatus: "idle" | "loading" | "succeeded" | "failed"; // TODO: Remove if unused
}
interface ChatState extends BaseState {
  conversations: GetAllConversationCards;
  conversationMessages: GetAllConversationMessageCards;
  activeConversationId: string | null;
}

export type {
  AuthState,
  PropertyState,
  ReportState,
  ReportRequestState,
  UserState,
  ChatState,
};
