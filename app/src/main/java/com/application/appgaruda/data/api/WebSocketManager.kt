package com.application.appgaruda.data.api

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.application.appgaruda.data.model.DebateMessage
import com.application.appgaruda.data.model.SendMessageRequest
import com.google.gson.Gson
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import org.json.JSONObject

class WebSocketManager(private val sessionId: Int) {

    private val gson = Gson()
    private var listener: WebSocketListener? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    // Pindahkan deklarasi onReceiveMessage di sini, sebelum init
    private val onReceiveMessage = Emitter.Listener { args ->
        runCatching {
            val json = args[0] as JSONObject
            val msgObj = json.getJSONObject("message")
            val msg = gson.fromJson(msgObj.toString(), DebateMessage::class.java)
            post { listener?.onMessageReceived(listOf(msg)) }
        }.onFailure { e ->
            post { listener?.onError("Parse error: ${e.message}") }
        }
    }

    private var socket: Socket

    interface WebSocketListener {
        fun onMessageReceived(messages: List<DebateMessage>)
        fun onConnectionOpened()
        fun onConnectionClosed()
        fun onError(error: String)
    }

    fun setListener(l: WebSocketListener) {
        listener = l
    }

    init {
        val opts = IO.Options().apply {
            reconnection = true
            timeout = 10_000
        }
        socket = IO.socket("http://10.0.2.2:3000", opts)
        socket.on(Socket.EVENT_CONNECT) { onConnect() }
        socket.on(Socket.EVENT_DISCONNECT) { onDisconnect() }
        socket.on(Socket.EVENT_CONNECT_ERROR) { args ->
            val err = args.firstOrNull()?.toString() ?: "Unknown"
            post { listener?.onError("Connect error: $err") }
        }
        socket.on("receiveMessage", onReceiveMessage)
    }

    private fun onConnect() {
        post {
            Log.d("WS", "Connected")
            listener?.onConnectionOpened()
            socket.emit("joinRoom", sessionId)
        }
    }

    private fun onDisconnect() {
        post {
            Log.d("WS", "Disconnected")
            listener?.onConnectionClosed()
        }
    }

    fun connect() = socket.connect()

    fun sendMessage(req: SendMessageRequest) {
        val json = JSONObject(gson.toJson(req))
        socket.emit("sendMessage", json)
    }

    fun disconnect() = socket.disconnect()

    fun isConnected(): Boolean = socket.connected()

    private fun post(fn: () -> Unit) {
        mainHandler.post(fn)
    }
}
