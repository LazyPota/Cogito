// HomeViewModelFactory.kt
package com.application.appgaruda.factory

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.application.appgaruda.data.repository.IssueRepository
import com.application.appgaruda.ui.fragment.home.HomeViewModel

class HomeViewModelFactory(private val repo: IssueRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return HomeViewModel(repo) as T
        }
        throw IllegalArgumentException("Unknown VM class")
    }
}
