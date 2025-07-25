package com.application.appgaruda.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.AuthRepository
import com.application.appgaruda.helper.SessionManager
import com.application.appgaruda.ui.viewmodel.AuthViewModel
import com.application.appgaruda.ui.viewmodel.AuthViewModelFactory

class RegisterActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: AuthViewModel

    private lateinit var tvUsername: EditText
    private lateinit var tvPassword: EditText
    private lateinit var btnRegister: Button
    private lateinit var btnLogin: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // 1️⃣ Inisialisasi SessionManager
        sessionManager = SessionManager(this)

        // 2️⃣ Buat ApiService, Repository, Factory, lalu ViewModel
        val apiService = RetrofitClient.getApiService(sessionManager)
        val repository = AuthRepository(apiService)
        val factory = AuthViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory)[AuthViewModel::class.java]

        // 3️⃣ Binding UI
        tvUsername = findViewById(R.id.tvUsername)
        tvPassword = findViewById(R.id.tvPassword)
        btnRegister = findViewById(R.id.btnRegister)
        btnLogin    = findViewById(R.id.btnLogin)

        // 4️⃣ Navigasi ke Login
        btnLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        // 5️⃣ Aksi Register
        btnRegister.setOnClickListener {
            val username = tvUsername.text.toString().trim()
            val password = tvPassword.text.toString().trim()
            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Username & password wajib diisi", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.register(username, password)
            }
        }

        // 6️⃣ Observe hasil register
        observeViewModel()
    }

    private fun observeViewModel() {
        viewModel.registerResult.observe(this) { response ->
            if (response.isSuccessful && response.body()?.status == "success") {
                Toast.makeText(this, "Register berhasil! 🎉", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            } else {
                val msg = response.body()?.message ?: response.message()
                Toast.makeText(this, "Gagal register: $msg", Toast.LENGTH_LONG).show()
            }
        }
    }
}
