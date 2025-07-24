package com.application.appgaruda.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.application.appgaruda.R
import com.application.appgaruda.helper.SessionManager
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText

class LoginActivity : AppCompatActivity() {
    private lateinit var edtUsername: TextInputEditText
    private lateinit var edtPassword: TextInputEditText
    private lateinit var btnLogin: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Inset padding biar gak ketimpa status bar/navigation bar
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        edtUsername = findViewById(R.id.tvUsername)
        edtPassword = findViewById(R.id.tvPassword)
        btnLogin = findViewById(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val username = edtUsername.text.toString()
            val password = edtPassword.text.toString()

            // Validasi
            if (username.isEmpty()) {
                edtUsername.error = "Username tidak boleh kosong"
                edtUsername.requestFocus()
                return@setOnClickListener
            }

            if (password.isEmpty()) {
                edtPassword.error = "Password tidak boleh kosong"
                edtPassword.requestFocus()
                return@setOnClickListener
            }

            if (password.length < 4) {
                edtPassword.error = "Password minimal 4 karakter"
                edtPassword.requestFocus()
                return@setOnClickListener
            }

            checkLogin(username, password)
        }
    }

    private fun checkLogin(username: String, password: String) {
        val session = SessionManager(this)
        if (username == "user" && password == "user") {
            session.setLogin(true)
            Toast.makeText(this, "Login Berhasil", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        } else {
            session.setLogin(false)
            Toast.makeText(this, "Username atau Password salah", Toast.LENGTH_SHORT).show()
        }
    }
}
