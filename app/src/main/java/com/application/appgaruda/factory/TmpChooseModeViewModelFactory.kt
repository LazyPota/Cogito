package com.application.appgaruda.factory

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.application.appgaruda.data.repository.IssueRepository
import com.application.appgaruda.ui.fragment.tmp_choose_mode.TmpChooseModeViewModel

class TmpChooseModeViewModelFactory(private val repository: IssueRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(TmpChooseModeViewModel::class.java)) {
            return TmpChooseModeViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

