package com.application.appgaruda.data.api.service

import com.application.appgaruda.data.model.UserResponses
import retrofit2.http.*

interface UserService {
    @GET("users")
    suspend fun getUsers(): List<UserResponses>
}