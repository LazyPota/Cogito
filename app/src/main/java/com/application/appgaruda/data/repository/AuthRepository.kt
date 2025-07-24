package com.application.appgaruda.data.repository

import com.application.appgaruda.data.api.RetrofitClient.apiService
import com.application.appgaruda.data.api.service.ApiService
import com.application.appgaruda.data.model.request.LoginRequest
import com.application.appgaruda.data.model.request.RegisterRequest
import com.application.appgaruda.data.model.response.RegisterResponse
import retrofit2.Response

class AuthRepository(private val api: ApiService) {
    suspend fun login(request: LoginRequest) = api.login(request)
    suspend fun register(request: RegisterRequest): Response<RegisterResponse> {
        return apiService.register(request)
    }

}

