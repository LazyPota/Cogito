package com.application.appgaruda.ui.viewmodel

import androidx.lifecycle.*
import com.application.appgaruda.data.model.response.TopicModelHome
import com.application.appgaruda.data.repository.IssueRepository
import kotlinx.coroutines.launch

class IssuesViewModel(private val repo: IssueRepository) : ViewModel() {

    private val _topics = MutableLiveData<List<TopicModelHome>>()
    val topics: LiveData<List<TopicModelHome>> = _topics

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun fetchTopics() {
        viewModelScope.launch {
            try {
                val list = repo.fetchTopics()
                _topics.postValue(list)
            } catch (e: Exception) {
                _error.postValue(e.message ?: "Unknown error")
            }
        }
    }
}

