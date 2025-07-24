package com.application.appgaruda.data.api.service


import com.application.appgaruda.data.model.request.LoginRequest
import com.application.appgaruda.data.model.request.RegisterRequest
import com.application.appgaruda.data.model.response.LoginResponse
import com.application.appgaruda.data.model.response.RegisterResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("/api/v1/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("/api/v1/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

}