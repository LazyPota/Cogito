package com.application.appgaruda.data.model.request

data class CreateSessionRequest(
    val issue_id: Int,
    val pro_user_id: Int,
    val contra_user_id: Int? = null,
    val is_vs_ai: Boolean,
    val session_name: String
)
