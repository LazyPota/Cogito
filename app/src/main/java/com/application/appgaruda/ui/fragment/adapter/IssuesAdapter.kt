package com.application.appgaruda.ui.fragment.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.model.response.TopicModelHome

class IssuesAdapter(
    private val topics: List<TopicModelHome>,
    private val onProClick: (TopicModelHome) -> Unit
) : RecyclerView.Adapter<IssuesAdapter.ViewHolder>() {

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvLevel: TextView = view.findViewById(R.id.tv_level)
        val tvJudul: TextView = view.findViewById(R.id.tv_judul)
        val tvDeskripsiSingkat: TextView = view.findViewById(R.id.tv_deskrip_singkat)
        val btnStartDebate: Button = view.findViewById(R.id.btn_start_debate)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_issues_topic, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val topic = topics[position]
        holder.tvLevel.text = "Intermediate"
        holder.tvJudul.text = topic.title
        holder.tvDeskripsiSingkat.text = topic.description

        holder.btnStartDebate.setOnClickListener { onProClick(topic) }
    }

    override fun getItemCount(): Int = topics.size
}
