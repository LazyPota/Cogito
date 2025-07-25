package com.application.appgaruda.data.model

// Data classes untuk request dan response
data class SendMessageRequest(
    val sessionId: Int,
    val senderUserId: Int?,
    val senderRole: String,
    val messageOriginal: String
)

data class CreateSessionRequest(
    val issue_id: Int,
    val pro_user_id: Int,
    val contra_user_id: Int?,
    val is_vs_ai: Boolean,
    val session_name: String
)

data class DebateMessage(
    val id: Int,
    val session_id: Int,
    val sender_user_id: Int?,
    val sender_role: String,
    val message_original: String,
    val message_translated: String,
    val created_at: String
)

data class DebateSession(
    val id: Int,
    val issue_id: Int,
    val pro_user_id: Int,
    val contra_user_id: Int?,
    val is_vs_ai: Boolean,
    val session_name: String,
    val status: String,
    val created_at: String,
    val updated_at: String,
    val debates: List<DebateMessage>? = null
)

data class ApiResponse<T>(
    val status: String,
    val message: String,
    val data: T
)

// Message wrapper untuk UI
data class ChatMessage(
    val id: Int,
    val message: String,
    val senderRole: String, // "pro" atau "contra"
    val timestamp: String,
    val isFromUser: Boolean
) {
    companion object {
        fun fromDebateMessage(debateMessage: DebateMessage): ChatMessage {
            return ChatMessage(
                id = debateMessage.id,
                message = debateMessage.message_translated,
                senderRole = debateMessage.sender_role,
                timestamp = debateMessage.created_at,
                isFromUser = debateMessage.sender_user_id != null
            )
        }
    }
}