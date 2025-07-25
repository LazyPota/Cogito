package com.application.appgaruda.data.model

data class IssueByIdResponse(
    val status: Boolean,
    val message: String,
    val data: IssueDetail
)

data class IssueDetail(
    val id: Int,
    val title: String,
    val pro_description: String,
    val contra_description: String
)


