package com.application.appgaruda.data.model.request

// file: com.application.appgaruda.data.model.request.SendMessageRequest.kt
data class SendMessageRequest(
    val sessionId: Int,
    val senderUserId: Int?,
    val senderRole: String,
    val messageOriginal: String
)
