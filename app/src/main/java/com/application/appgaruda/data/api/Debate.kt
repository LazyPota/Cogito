package com.application.appgaruda.data.api

import android.content.Context
import com.application.appgaruda.data.model.ApiResponse
import com.application.appgaruda.data.model.CreateSessionRequest
import com.application.appgaruda.data.model.DebateMessage
import com.application.appgaruda.data.model.DebateSession
import com.application.appgaruda.data.model.SendMessageRequest
import com.application.appgaruda.helper.SessionManager
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import java.util.concurrent.TimeUnit

// API Interface
interface DebateApiService {

    @POST("sessions")
    fun createSession(@Body request: CreateSessionRequest): Call<ApiResponse<DebateSession>>

    @GET("sessions/{sessionId}")
    fun getSession(@Path("sessionId") sessionId: Int): Call<ApiResponse<DebateSession>>

    @POST("messages")
    fun sendMessage(@Body request: SendMessageRequest): Call<ApiResponse<List<DebateMessage>>>

    @GET("sessions/{sessionId}/messages")
    fun getMessages(@Path("sessionId") sessionId: Int): Call<ApiResponse<List<DebateMessage>>>
}

// Network Manager
class NetworkManager private constructor(private val context: Context) {

    companion object {
        private const val BASE_URL = "http://10.0.2.2:3000/api/v1/debates/"
        @Volatile
        private var INSTANCE: NetworkManager? = null

        fun getInstance(context: Context): NetworkManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: NetworkManager(context.applicationContext).also { INSTANCE = it }
            }
        }
    }

    private val apiService: DebateApiService

    init {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val original = chain.request()
                val builder = original.newBuilder()

                // Ambil token dari SessionManager
                val token = SessionManager(context).getToken()
                if (!token.isNullOrEmpty()) {
                    builder.addHeader("Authorization", "Bearer $token")
                }

                val request = builder.build()
                chain.proceed(request)
            }
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()


        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        apiService = retrofit.create(DebateApiService::class.java)
    }

    // Create new debate session
    fun createSession(
        request: CreateSessionRequest,
        onSuccess: (DebateSession) -> Unit,
        onError: (String) -> Unit
    ) {
        apiService.createSession(request).enqueue(object : Callback<ApiResponse<DebateSession>> {
            override fun onResponse(
                call: Call<ApiResponse<DebateSession>>,
                response: Response<ApiResponse<DebateSession>>
            ) {
                if (response.isSuccessful) {
                    response.body()?.let { apiResponse ->
                        if (apiResponse.status == "success") {
                            onSuccess(apiResponse.data)
                        } else {
                            onError(apiResponse.message)
                        }
                    } ?: onError("Empty response")
                } else {
                    onError("HTTP ${response.code()}: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<ApiResponse<DebateSession>>, t: Throwable) {
                onError("Network error: ${t.message}")
            }
        })
    }

    // Get session details
    fun getSession(
        sessionId: Int,
        onSuccess: (DebateSession) -> Unit,
        onError: (String) -> Unit
    ) {
        apiService.getSession(sessionId).enqueue(object : Callback<ApiResponse<DebateSession>> {
            override fun onResponse(
                call: Call<ApiResponse<DebateSession>>,
                response: Response<ApiResponse<DebateSession>>
            ) {
                if (response.isSuccessful) {
                    response.body()?.let { apiResponse ->
                        if (apiResponse.status == "success") {
                            onSuccess(apiResponse.data)
                        } else {
                            onError(apiResponse.message)
                        }
                    } ?: onError("Empty response")
                } else {
                    onError("HTTP ${response.code()}: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<ApiResponse<DebateSession>>, t: Throwable) {
                onError("Network error: ${t.message}")
            }
        })
    }

    // Send message via HTTP (alternative to WebSocket)
    fun sendMessage(
        request: SendMessageRequest,
        onSuccess: (List<DebateMessage>) -> Unit,
        onError: (String) -> Unit
    ) {
        apiService.sendMessage(request).enqueue(object : Callback<ApiResponse<List<DebateMessage>>> {
            override fun onResponse(
                call: Call<ApiResponse<List<DebateMessage>>>,
                response: Response<ApiResponse<List<DebateMessage>>>
            ) {
                if (response.isSuccessful) {
                    response.body()?.let { apiResponse ->
                        if (apiResponse.status == "success") {
                            onSuccess(apiResponse.data)
                        } else {
                            onError(apiResponse.message)
                        }
                    } ?: onError("Empty response")
                } else {
                    onError("HTTP ${response.code()}: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<ApiResponse<List<DebateMessage>>>, t: Throwable) {
                onError("Network error: ${t.message}")
            }
        })
    }

    // Get all messages for a session
    fun getMessages(
        sessionId: Int,
        onSuccess: (List<DebateMessage>) -> Unit,
        onError: (String) -> Unit
    ) {
        apiService.getMessages(sessionId).enqueue(object : Callback<ApiResponse<List<DebateMessage>>> {
            override fun onResponse(
                call: Call<ApiResponse<List<DebateMessage>>>,
                response: Response<ApiResponse<List<DebateMessage>>>
            ) {
                if (response.isSuccessful) {
                    response.body()?.let { apiResponse ->
                        if (apiResponse.status == "success") {
                            onSuccess(apiResponse.data)
                        } else {
                            onError(apiResponse.message)
                        }
                    } ?: onError("Empty response")
                } else {
                    onError("HTTP ${response.code()}: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<ApiResponse<List<DebateMessage>>>, t: Throwable) {
                onError("Network error: ${t.message}")
            }
        })
    }
}