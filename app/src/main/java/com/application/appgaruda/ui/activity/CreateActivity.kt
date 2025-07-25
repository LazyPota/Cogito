package com.application.appgaruda.ui.activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.application.appgaruda.R
import com.application.appgaruda.data.api.NetworkManager
import com.application.appgaruda.data.model.CreateSessionRequest
import com.application.appgaruda.data.model.DebateSession
import com.application.appgaruda.helper.SessionManager

class CreateActivity : AppCompatActivity() {

    private lateinit var etSessionName: EditText
    private lateinit var btnCreateSession: Button
    private lateinit var progressBar: ProgressBar

    private lateinit var networkManager: NetworkManager
    private lateinit var sessionManager: SessionManager
    private var currentUserId : Int = 1 // Replace with actual user ID
    private var sessionName: String = "session1"
    private var topicId: String? = null
    private var side: String? = null
    private var title: String? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create)

        initViews()
        val sharedPref = getSharedPreferences("debate_pref", Context.MODE_PRIVATE)
        topicId = sharedPref.getString("topicId", null)
        side = sharedPref.getString("side", null)
        title = sharedPref.getString("title", null)
        if (title != null) {
            etSessionName.setText(title)
            sessionName = title as String
        }

        sessionManager = SessionManager(this)
        currentUserId = sessionManager.getUserId()
        setupListeners()

        networkManager = NetworkManager.getInstance(this)
    }

    private fun initViews() {
        etSessionName = findViewById(R.id.etSessionName)
        btnCreateSession = findViewById(R.id.btnCreateSession)
        progressBar = findViewById(R.id.progressBar)
    }

    private fun setupListeners() {
        btnCreateSession.setOnClickListener {
            createDebateSession()
            btnCreateSession.isEnabled = false
        }
    }

    private fun createDebateSession() {
        sessionName = etSessionName.text.toString().trim()
        if (sessionName.isEmpty()) {
            showToast("Please enter session name")
            return
        }
        showLoading(true)
        val request = topicId?.toIntOrNull()?.let {
            CreateSessionRequest(
                issue_id = it, // Default issue ID
                pro_user_id = currentUserId,
                contra_user_id = null, // AI opponent
                is_vs_ai = true,
                session_name = sessionName
            )
        }

        if (request != null) {
            networkManager.createSession(
                request = request,
                onSuccess = { session ->
                    showLoading(false)
                    navigateToChat(session)
                },
                onError = { error ->
                    showLoading(false)
                    Log.d("on error", "Failed to create session: $error")
                    showToast("Failed to create session: $error")
                }
            )
        }
    }

    private fun navigateToChat(session: DebateSession) {
        val intent = Intent(this, ChatActivity::class.java).apply {
            putExtra("SESSION_ID", session.id)
            putExtra("SESSION_NAME", session.session_name)
            putExtra("SESSION_STATUS", session.status)
        }
        startActivity(intent)
    }

    private fun showLoading(show: Boolean) {
        if (show) {
            progressBar.visibility = android.view.View.VISIBLE
            btnCreateSession.isEnabled = false
        } else {
            progressBar.visibility = android.view.View.GONE
            btnCreateSession.isEnabled = true
        }
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}