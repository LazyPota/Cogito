package com.application.appgaruda.ui.viewmodel

import android.util.Log
import androidx.lifecycle.*
import com.application.appgaruda.data.model.request.LoginRequest
import com.application.appgaruda.data.model.request.RegisterRequest
import com.application.appgaruda.data.model.response.LoginResponse
import com.application.appgaruda.data.model.response.RegisterResponse

import com.application.appgaruda.data.repository.AuthRepository
import kotlinx.coroutines.launch
import retrofit2.Response

class AuthViewModel(private val repo: AuthRepository) : ViewModel() {

    private val _loginResult = MutableLiveData<Response<LoginResponse>>()
    val loginResult: LiveData<Response<LoginResponse>> = _loginResult

    fun login(username: String, password: String) {
        viewModelScope.launch {
            val request = LoginRequest(username, password)
            val response = repo.login(request)
            _loginResult.value = response
        }
    }

    private val _registerResult = MutableLiveData<Response<RegisterResponse>>()
    val registerResult: LiveData<Response<RegisterResponse>> = _registerResult


    fun register(username: String, email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = repo.register(RegisterRequest(username, email, password))
                _registerResult.postValue(response)
                Log.d("RegisterResponse", response.toString())
            } catch (e: Exception) {
                Log.e("RegisterError", e.toString())
            }
        }
    }

}

class AuthViewModelFactory(private val repo: AuthRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return AuthViewModel(repo) as T
    }
}
