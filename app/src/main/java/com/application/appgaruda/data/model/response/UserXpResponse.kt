package com.application.appgaruda.data.model.response

data class UserXpResponse(
    val status: String,
    val data: UserDataXp
)

data class UserDataXp(
    val xp: Int
)
