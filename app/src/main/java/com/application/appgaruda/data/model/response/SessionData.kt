package com.application.appgaruda.data.model.response

// file: com.application.appgaruda.data.model.response.SessionData.kt
data class SessionData(
    val id: Int,
    val issue_id: Int,
    val pro_user_id: Int,
    val contra_user_id: Int?,
    val is_vs_ai: Boolean,
    val session_name: String,
    val status: String,
    val created_at: String,
    val updated_at: String
)

// file: com.application.appgaruda.data.model.response.CreateSessionResponse.kt
data class CreateSessionResponse(
    val status: String,
    val message: String,
    val data: SessionData
)
