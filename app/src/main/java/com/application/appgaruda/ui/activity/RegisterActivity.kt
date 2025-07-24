package com.application.appgaruda.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.AuthRepository
import com.application.appgaruda.ui.viewmodel.AuthViewModel
import com.application.appgaruda.ui.viewmodel.AuthViewModelFactory

class RegisterActivity : AppCompatActivity() {

    private lateinit var viewModel: AuthViewModel
    private lateinit var tvUsername: EditText
    private lateinit var tvEmail: EditText
    private lateinit var tvPassword: EditText
    private lateinit var btnRegister: Button
    private lateinit var btnLogin: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // Init
        val factory = AuthViewModelFactory(AuthRepository(RetrofitClient.apiService))
        viewModel = ViewModelProvider(this, factory)[AuthViewModel::class.java]

        tvUsername = findViewById(R.id.tvUsername)
        tvEmail = findViewById(R.id.tvEmail)
        tvPassword = findViewById(R.id.tvPassword)
        btnRegister = findViewById(R.id.btnRegister)
        btnLogin = findViewById(R.id.btnLogin)
        //* ini register
        btnLogin.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        btnRegister.setOnClickListener {
            val username = tvUsername.text.toString()
            val email = tvEmail.text.toString()
            val password = tvPassword.text.toString()
            viewModel.register(username, email, password)
        }

        btnLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        observeViewModel()
    }

    private fun observeViewModel() {
        viewModel.registerResult.observe(this) { response ->
            if (response.isSuccessful && response.body()?.status == "success") {
                Toast.makeText(this, "Register berhasil! 🎉", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            } else {
                Toast.makeText(
                    this,
                    "Gagal register: ${response.body()?.message ?: response.message()}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
}
