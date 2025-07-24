package com.application.appgaruda.ui.activity

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.application.appgaruda.helper.SessionManager


class SplashActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sessionManager = SessionManager(this)

        // Bisa ditambah animasi / delay jika perlu
        checkLoginStatus()
    }

    private fun checkLoginStatus() {
        if (sessionManager.isLoggedIn()) {
            // Kalau udah login, langsung ke HomeActivity
            startActivity(Intent(this, MainActivity::class.java))
        } else {
            // Belum login, arahkan ke LoginActivity
            startActivity(Intent(this, LoginActivity::class.java))
        }
        finish() // biar splash gak bisa balik pakai tombol back
    }
}