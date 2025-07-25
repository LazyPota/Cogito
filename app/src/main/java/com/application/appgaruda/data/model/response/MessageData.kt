package com.application.appgaruda.data.model.response

// file: com.application.appgaruda.data.model.response.MessageData.kt
data class MessageData(
    val id: Int,
    val session_id: Int,
    val sender_user_id: Int?,
    val sender_role: String,
    val message_original: String,
    val message_translated: String,
    val created_at: String
)

// file: com.application.appgaruda.data.model.response.SendMessageResponse.kt
data class SendMessageResponse(
    val status: String,
    val message: String,
    val data: List<MessageData>
)
