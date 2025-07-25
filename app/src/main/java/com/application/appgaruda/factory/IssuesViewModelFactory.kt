package com.application.appgaruda.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.application.appgaruda.data.repository.IssueRepository

class IssuesViewModelFactory(private val repository: IssueRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(IssuesViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return IssuesViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
