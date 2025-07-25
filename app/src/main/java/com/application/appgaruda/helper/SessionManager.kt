package com.application.appgaruda.helper

import android.content.Context
import android.content.SharedPreferences
import android.widget.Toast

class SessionManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREF_NAME = "user_session"
        private const val KEY_TOKEN = "token"
        private const val KEY_USERNAME = "username"
        private const val KEY_USER_ID = "user_id"
    }

    fun saveSession(token: String, id: Int, username: String) {
        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putInt(KEY_USER_ID, id)
            .putString(KEY_USERNAME, username)
            .apply()
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun getUserId(): Int {
        return prefs.getInt(KEY_USER_ID, -1)
    }

    fun getUsername(): String? {
        return prefs.getString(KEY_USERNAME, "Cannot Catch Username")
    }

    fun clearSession() {
        prefs.edit().clear().apply()
    }

    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}
