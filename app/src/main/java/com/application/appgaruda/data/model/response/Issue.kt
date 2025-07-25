package com.application.appgaruda.data.model.response

data class Issue(
    val id: Int,
    val title: String,
    val description: String,
    val contra_description: String,
    val pro_description: String,
    val image: String,
    val created_at: String
)
