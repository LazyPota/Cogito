// HomeViewModel.kt
package com.application.appgaruda.ui.fragment.home

import android.util.Log
import androidx.lifecycle.*
import com.application.appgaruda.data.model.response.Issue
import com.application.appgaruda.data.repository.IssueRepository
import kotlinx.coroutines.launch

class HomeViewModel(private val repository: IssueRepository) : ViewModel() {

    private val _issues = MutableLiveData<List<Issue>>()
    val issues: LiveData<List<Issue>> = _issues

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun fetchIssues() {
        viewModelScope.launch {
            try {
                val list = repository.fetchIssues()
                _issues.postValue(list)
            } catch (e: Exception) {
                _error.postValue(e.message ?: "Unknown error")
            }
        }
    }

    private val _userXp = MutableLiveData<Int>()
    val userXp: LiveData<Int> = _userXp

    fun fetchUserXp(username: String) {
        viewModelScope.launch {
            val xp = repository.getUserXp(username)
            xp?.let {
                _userXp.value = it
                Log.d("ViewModel", "XP User $username: $it")
            }
        }
    }
}
