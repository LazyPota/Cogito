package com.application.appgaruda.data.repository

import com.application.appgaruda.data.api.service.ApiService
import com.application.appgaruda.data.model.request.LoginRequest
import com.application.appgaruda.data.model.request.RegisterRequest
import com.application.appgaruda.data.model.response.LoginResponse
import com.application.appgaruda.data.model.response.RegisterResponse
import retrofit2.Response

class AuthRepository(private val apiService: ApiService) {

    /**
     * Panggil endpoint login, return langsung Response<LoginResponse>
     */
    suspend fun login(request: LoginRequest): Response<LoginResponse> {
        return apiService.login(request)
    }

    /**
     * Panggil endpoint register, return Response<RegisterResponse>
     */
    suspend fun register(request: RegisterRequest): Response<RegisterResponse> {
        return apiService.register(request)
    }
}
