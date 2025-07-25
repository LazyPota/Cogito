package com.application.appgaruda.ui.activity

import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView

import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.api.WebSocketManager
import com.application.appgaruda.data.model.ChatMessage
import com.application.appgaruda.data.model.DebateMessage
import com.application.appgaruda.data.model.SendMessageRequest
import com.application.appgaruda.ui.fragment.adapter.ChatMessagesAdapter
import java.util.Locale

class ChatActivity : AppCompatActivity(), WebSocketManager.WebSocketListener {

    private lateinit var rvChatMessages: RecyclerView
    private lateinit var etMessage: EditText
    private lateinit var btnSend: ImageButton
    private lateinit var btnBack: ImageView
    private lateinit var tvSessionName: TextView
    private lateinit var tvSessionStatus: TextView

    private lateinit var chatAdapter: ChatMessagesAdapter
    private lateinit var webSocketManager: WebSocketManager

    private var currentSessionId: Int = 0
    private var currentUserId: Int = 1 // Replace dengan SessionManager jika perlu
    private var isSendingMessage = false
    private var side: String? = "pro"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_chat) // ganti jadi activity_chat.xml

        initViews()
        setupAdapter()
        setupListeners()

        // Ambil sessionId, sessionName, sessionStatus dari Intent
        currentSessionId = intent.getIntExtra("SESSION_ID", 0)
        val sessionName = intent.getStringExtra("SESSION_NAME") ?: "Debat Session"
        val sessionStatus = intent.getStringExtra("SESSION_STATUS") ?: "Active"
        tvSessionName.text = sessionName
        tvSessionStatus.text = sessionStatus

        // Inisialisasi WebSocketManager dengan sessionId
        webSocketManager = WebSocketManager(currentSessionId)
        webSocketManager.setListener(this)
        webSocketManager.connect() // connect tanpa URL
    }

    private fun initViews() {
        rvChatMessages = findViewById(R.id.rvChatMessages)
        etMessage = findViewById(R.id.etMessage)
        btnSend = findViewById(R.id.btnSend)
        btnBack = findViewById(R.id.btnBack)
        tvSessionName = findViewById(R.id.tvSessionName)
        tvSessionStatus = findViewById(R.id.tvSessionStatus)
    }

    private fun setupAdapter() {
        chatAdapter = ChatMessagesAdapter()
        rvChatMessages.apply {
            layoutManager = LinearLayoutManager(this@ChatActivity).apply {
                stackFromEnd = true
            }
            adapter = chatAdapter
        }
    }

    private fun setupListeners() {
        btnBack.setOnClickListener { finish() }
        btnSend.setOnClickListener { sendMessage() }
        etMessage.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                btnSend.isEnabled = !s.isNullOrBlank() && !isSendingMessage
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun sendMessage() {
        val messageText = etMessage.text.toString().trim()
        if (messageText.isEmpty() || isSendingMessage) return

        isSendingMessage = true
        btnSend.isEnabled = false

        // Ambil side dari SharedPreferences
        side = getSharedPreferences("debate_pref", Context.MODE_PRIVATE)
            .getString("side", "pro")
            ?.toLowerCase(Locale.ROOT)

        // Build request
        val request = SendMessageRequest(
            sessionId = currentSessionId,
            senderUserId = currentUserId,
            senderRole = side ?: "pro",
            messageOriginal = messageText
        )

        // Clear input & update UI
        etMessage.text.clear()
        val userMsg = ChatMessage(
            id = System.currentTimeMillis().toInt(),
            message = messageText,
            senderRole = request.senderRole,
            timestamp = getCurrentTimestamp(),
            isFromUser = true
        )
        chatAdapter.addMessage(userMsg)
        rvChatMessages.scrollToPosition(chatAdapter.itemCount - 1)

        // Kirim via Socket.IO
        webSocketManager.sendMessage(request)
    }

    private fun getCurrentTimestamp(): String =
        java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            .format(java.util.Date())

    // WebSocketListener impl
    override fun onMessageReceived(messages: List<DebateMessage>) {
        runOnUiThread {
            val newMsgs = messages
                .map { ChatMessage.fromDebateMessage(it) }
                .filter { !(it.isFromUser && it.senderRole == side) }
            if (newMsgs.isNotEmpty()) {
                chatAdapter.addMessages(newMsgs)
                rvChatMessages.scrollToPosition(chatAdapter.itemCount - 1)
            }
            isSendingMessage = false
            btnSend.isEnabled = etMessage.text.isNotBlank()
        }
    }

    override fun onConnectionOpened() = runOnUiThread {
        tvSessionStatus.text = "Connected"
    }

    override fun onConnectionClosed() = runOnUiThread {
        tvSessionStatus.text = "Disconnected"
    }

    override fun onError(error: String) = runOnUiThread {
        Log.d("ChatActivity", "onError: $error")
        tvSessionStatus.text = "Error"
        isSendingMessage = false
        btnSend.isEnabled = etMessage.text.isNotBlank()
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocketManager.disconnect()
    }
}
