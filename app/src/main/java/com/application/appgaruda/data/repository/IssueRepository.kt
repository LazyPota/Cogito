package com.application.appgaruda.data.repository

import android.util.Log
import com.application.appgaruda.data.api.service.ApiService

import com.application.appgaruda.data.model.IssueDetail
import com.application.appgaruda.data.model.response.Issue
import com.application.appgaruda.data.model.response.TopicModelHome

class IssueRepository(private val api: ApiService) {

    /**
     * Fetch seluruh Issue dari API,
     * lalu map ke TopicModelHome (hanya ambil id & title).
     */
    suspend fun fetchTopics(): List<TopicModelHome> {
        val resp = api.getIssues() // Response<IssueListResponse>
        if (resp.isSuccessful) {
            val issues: List<Issue> = resp.body()?.data ?: emptyList()
            // Map Issue -> TopicModelHome
            return issues.map { issue ->
                TopicModelHome(
                    id = issue.id,
                    title = issue.title,
                    description = issue.description
                )
            }
        } else {
            throw Exception("Fetch topics gagal: ${resp.code()} ${resp.message()}")
        }
    }

    // (Optional) Kalau masih butuh raw Issue list:
    suspend fun fetchIssues(): List<Issue> = api.getIssues()
        .takeIf { it.isSuccessful }
        ?.body()?.data
        ?: throw Exception("Fetch issues gagal")

    suspend fun getIssueById(id: String): IssueDetail? {
        val response = api.getIssuesById(id)
        return if (response.isSuccessful) {
            val data = response.body()?.data
            Log.d("API_SUCCESS", "Sukses ambil isu: $data")
            data
        } else {
            Log.e("API_ERROR", "Gagal ambil isu: ${response.errorBody()?.string()}")
            null
        }
    }

    suspend fun getUserXp(username: String): Int? {
        val response = api.getUserByUsername(username)
        return if (response.isSuccessful) {
            response.body()?.data?.xp
        } else {
            Log.e("API_ERROR", "Gagal ambil XP: ${response.errorBody()?.string()}")
            null
        }
    }
}
