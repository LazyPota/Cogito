package com.application.appgaruda.data.model.response

data class LoginResponse(
    val status: String,
    val message: String,
    val data: LoginData?
)

data class LoginData(
    val user: User,
    val token: String
)

data class User(
    val id: Int,
    val username: String,
    val email: String
)