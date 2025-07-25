package com.application.appgaruda.ui.fragment.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.model.ChatMessage
import java.text.SimpleDateFormat
import java.util.*

class ChatMessagesAdapter : RecyclerView.Adapter<ChatMessagesAdapter.MessageViewHolder>() {

    private val messages = mutableListOf<ChatMessage>()

    fun addMessage(message: ChatMessage) {
        messages.add(message)
        notifyItemInserted(messages.size - 1)
    }

    fun addMessages(newMessages: List<ChatMessage>) {
        val startPosition = messages.size
        messages.addAll(newMessages)
        notifyItemRangeInserted(startPosition, newMessages.size)
    }

    fun clearMessages() {
        messages.clear()
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_chat_message, parent, false)
        return MessageViewHolder(view)
    }

    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        holder.bind(messages[position])
    }

    override fun getItemCount(): Int = messages.size

    inner class MessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val layoutProMessage: LinearLayout = itemView.findViewById(R.id.layoutProMessage)
        private val layoutContraMessage: LinearLayout = itemView.findViewById(R.id.layoutContraMessage)
        private val tvProMessage: TextView = itemView.findViewById(R.id.tvProMessage)
        private val tvProTime: TextView = itemView.findViewById(R.id.tvProTime)
        private val tvContraMessage: TextView = itemView.findViewById(R.id.tvContraMessage)
        private val tvContraTime: TextView = itemView.findViewById(R.id.tvContraTime)

        fun bind(message: ChatMessage) {
            // Hide both layouts first
            layoutProMessage.visibility = View.GONE
            layoutContraMessage.visibility = View.GONE

            val timeFormatted = formatTime(message.timestamp)

            if (message.senderRole == "pro") {
                // Show pro message (user message)
                layoutProMessage.visibility = View.VISIBLE
                tvProMessage.text = message.message
                tvProTime.text = "PRO SIDE"
            } else {
                // Show contra message (AI message)
                layoutContraMessage.visibility = View.VISIBLE
                tvContraMessage.text = message.message
                tvContraTime.text = "CONTRA SIDE"
            }
        }

        private fun formatTime(timestamp: String): String {
            return try {
                val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
                val outputFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
                val date = inputFormat.parse(timestamp)
                outputFormat.format(date ?: Date())
            } catch (e: Exception) {
                "00:00"
            }
        }
    }
}