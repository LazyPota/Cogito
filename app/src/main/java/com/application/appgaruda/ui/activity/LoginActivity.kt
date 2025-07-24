package com.application.appgaruda.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.AuthRepository
import com.application.appgaruda.helper.SessionManager
import com.application.appgaruda.ui.viewmodel.AuthViewModel
import com.application.appgaruda.ui.viewmodel.AuthViewModelFactory

class LoginActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    private val viewModel: AuthViewModel by viewModels {
        AuthViewModelFactory(AuthRepository(RetrofitClient.apiService))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)

        val etUsername = findViewById<EditText>(R.id.tvUsername)
        val etPassword = findViewById<EditText>(R.id.tvPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val btnRegister = findViewById<Button>(R.id.btnRegister)

        btnRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        btnLogin.setOnClickListener {
            val username = etUsername.text.toString()
            val password = etPassword.text.toString()
            viewModel.login(username, password)
        }

        observeViewModel()
    }

    private fun observeViewModel() {
        viewModel.loginResult.observe(this) { response ->
            if (response.isSuccessful && response.body()?.status == "success") {
                val user = response.body()!!.data!!.user
                val token = response.body()!!.data!!.token

                sessionManager.saveSession(
                    token,
                    user.id,
                    user.username,
                    user.email
                )

                Toast.makeText(this, "Login berhasil!", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            } else {
                Toast.makeText(this, "Login gagal: ${response.body()?.message ?: response.message()}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
