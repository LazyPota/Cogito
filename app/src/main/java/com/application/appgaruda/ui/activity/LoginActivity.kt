package com.application.appgaruda.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.AuthRepository
import com.application.appgaruda.helper.SessionManager
import com.application.appgaruda.ui.viewmodel.AuthViewModel
import com.application.appgaruda.ui.viewmodel.AuthViewModelFactory

class LoginActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: AuthViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // 1️⃣ Inisialisasi SessionManager dulu
        sessionManager = SessionManager(this)

        // 2️⃣ Setelah sessionManager siap, buat ApiService, Repository, Factory, lalu ViewModel
        val apiService = RetrofitClient.getApiService(sessionManager)
        val repository = AuthRepository(apiService)
        val factory = AuthViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory)[AuthViewModel::class.java]

        // 3️⃣ Setup UI references
        val etUsername = findViewById<EditText>(R.id.tvUsername)
        val etPassword = findViewById<EditText>(R.id.tvPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val btnRegister = findViewById<TextView>(R.id.btnRegister)

        btnRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
            finish()
        }

        btnLogin.setOnClickListener {
            val username = etUsername.text.toString().trim()
            val password = etPassword.text.toString().trim()
            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Username & password wajib diisi", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.login(username, password)
            }
        }

        observeViewModel()
    }

    private fun observeViewModel() {
        viewModel.loginResult.observe(this) { response ->
            if (response.isSuccessful && response.body()?.status == "success") {
                val user = response.body()!!.data!!.user
                val token = response.body()!!.data!!.token

                // Simpan session
                sessionManager.saveSession(
                    token,
                    user.id,
                    user.username
                )

                Toast.makeText(this, "Login berhasil!", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            } else {
                val message = response.body()?.message ?: response.message()
                Toast.makeText(this, "Login gagal: $message", Toast.LENGTH_LONG).show()
            }
        }
    }
}
