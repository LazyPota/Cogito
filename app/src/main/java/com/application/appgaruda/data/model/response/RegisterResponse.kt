package com.application.appgaruda.data.model.response

data class RegisterResponse(
    val status: String,
    val message: String,
    val data: UserData?
)

data class UserData(
    val id: String,
    val username: String,
)
