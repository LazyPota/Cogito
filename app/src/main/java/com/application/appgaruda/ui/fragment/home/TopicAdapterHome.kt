package com.application.appgaruda.ui.fragment.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.model.response.TopicModelHome

class TopicAdapterHome (
    private val topics: List<TopicModelHome>,
    private val onStartClick: (TopicModelHome) -> Unit
) : RecyclerView.Adapter<TopicAdapterHome.TopicViewHolder>() {

    inner class TopicViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val judulText: TextView = itemView.findViewById(R.id.Judul)
        val startButton: Button = itemView.findViewById(R.id.btn_start_pick)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TopicViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_topic, parent, false)
        return TopicViewHolder(view)
    }

    override fun onBindViewHolder(holder: TopicViewHolder, position: Int) {
        val topic = topics[position]
        holder.judulText.text = topic.title
        holder.startButton.setOnClickListener {
            onStartClick(topic)
        }
    }

    override fun getItemCount(): Int = topics.size
}