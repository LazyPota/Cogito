package com.application.appgaruda.ui.fragment.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.application.appgaruda.data.model.response.TopicModelHome

class HomeViewModel : ViewModel() {

    private val _topics = MutableLiveData<List<TopicModelHome>>()
    val topics: LiveData<List<TopicModelHome>> = _topics

    fun fetchTopics() {
        _topics.value = listOf(
            TopicModelHome(1, "AI in Healthcare"),
            TopicModelHome(2, "Climate Change Impact"),
            TopicModelHome(3, "The Ethics of AI")
        )
    }
}