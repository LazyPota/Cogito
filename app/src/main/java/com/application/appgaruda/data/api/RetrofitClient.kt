package com.application.appgaruda.data.api

import android.content.Context
import com.application.appgaruda.data.api.service.ApiService
import com.application.appgaruda.helper.AuthInterceptor
import com.application.appgaruda.helper.SessionManager
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    fun getApiService(sessionManager: SessionManager): ApiService {
        val client = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(sessionManager))
            .build()

        return Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}

