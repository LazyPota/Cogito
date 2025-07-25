package com.application.appgaruda.data.api.service


import com.application.appgaruda.data.model.IssueByIdResponse
import com.application.appgaruda.data.model.request.CreateSessionRequest
import com.application.appgaruda.data.model.request.LoginRequest
import com.application.appgaruda.data.model.request.RegisterRequest
import com.application.appgaruda.data.model.request.SendMessageRequest
import com.application.appgaruda.data.model.response.CreateSessionResponse
import com.application.appgaruda.data.model.response.IssueListResponse
import com.application.appgaruda.data.model.response.LoginResponse
import com.application.appgaruda.data.model.response.RegisterResponse
import com.application.appgaruda.data.model.response.SendMessageResponse
import com.application.appgaruda.data.model.response.SessionWithDebatesResponse
import com.application.appgaruda.data.model.response.UserXpResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("/api/v1/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("/api/v1/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    @GET("/api/v1/issues")
    suspend fun getIssues(): Response<IssueListResponse>

    @GET("/api/v1/issues/{id}")
    suspend fun getIssuesById(@Path("id") id: String?): Response<IssueByIdResponse>

    @GET("/api/v1/users/{username}")
    suspend fun getUserByUsername(
        @Path("username") username: String
    ): Response<UserXpResponse>

    @POST("debate-session")
    suspend fun createDebateSession(
        @Body request: CreateSessionRequest
    ): Response<CreateSessionResponse>

    @POST("debate-message")
    suspend fun sendDebateMessage(
        @Body request: SendMessageRequest
    ): Response<SendMessageResponse>

    @GET("debate-session/{id}")
    suspend fun getSessionWithDebates(
        @Path("id") sessionId: Int
    ): Response<SessionWithDebatesResponse>
}
