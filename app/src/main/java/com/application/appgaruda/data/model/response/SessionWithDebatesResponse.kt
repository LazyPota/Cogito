package com.application.appgaruda.data.model.response

data class SessionWithDebatesResponse(
    val status: String,
    val data: SessionWithDebates
)

data class SessionWithDebates(
    val id: Int,
    val issue_id: Int,
    val pro_user_id: Int,
    val contra_user_id: Int?,
    val is_vs_ai: Boolean,
    val session_name: String,
    val status: String,
    val created_at: String,
    val updated_at: String,
    val debates: List<MessageData>
)
