package com.application.appgaruda.data.repository

import com.application.appgaruda.data.api.service.ApiService
import com.application.appgaruda.data.model.request.CreateSessionRequest
import com.application.appgaruda.data.model.request.SendMessageRequest
import com.application.appgaruda.data.model.response.CreateSessionResponse
import com.application.appgaruda.data.model.response.SendMessageResponse
import com.application.appgaruda.data.model.response.SessionWithDebatesResponse

class DebateRepository(private val api: ApiService) {

    suspend fun createDebateSession(req: CreateSessionRequest): CreateSessionResponse {
        val res = api.createDebateSession(req)
        if (res.isSuccessful) return res.body()!!
        else throw Exception("Gagal bikin sesi debat")
    }

    suspend fun sendDebateMessage(req: SendMessageRequest): SendMessageResponse {
        val res = api.sendDebateMessage(req)
        if (res.isSuccessful) return res.body()!!
        else throw Exception("Gagal kirim pesan debat")
    }

    suspend fun getSessionWithDebates(id: Int): SessionWithDebatesResponse {
        val res = api.getSessionWithDebates(id)
        if (res.isSuccessful) return res.body()!!
        else throw Exception("Gagal ambil data sesi")
    }
}
