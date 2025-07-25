package com.application.appgaruda.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.application.appgaruda.data.model.response.SessionWithDebatesResponse
import com.application.appgaruda.data.repository.DebateRepository
import kotlinx.coroutines.launch

class DebateViewModel(private val repo: DebateRepository) : ViewModel() {

    private val _session = MutableLiveData<SessionWithDebatesResponse>()
    val session: LiveData<SessionWithDebatesResponse> = _session

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun loadSession(id: Int) {
        viewModelScope.launch {
            try {
                val result = repo.getSessionWithDebates(id)
                _session.postValue(result)
            } catch (e: Exception) {
                _error.postValue(e.message)
            }
        }
    }
}
