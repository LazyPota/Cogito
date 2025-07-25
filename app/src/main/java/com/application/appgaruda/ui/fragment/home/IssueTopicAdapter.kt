package com.application.appgaruda.ui.fragment.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.model.response.Issue

class IssueTopicAdapter(
    private var topics: List<Issue>,
    private val onClick: (Issue) -> Unit
) : RecyclerView.Adapter<IssueTopicAdapter.ViewHolder>() {

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val tvTitle: TextView = view.findViewById(R.id.Judul)
        private val tvDescription: TextView = view.findViewById(R.id.deskrip_singkat)
        fun bind(issue: Issue) {
            tvTitle.text = issue.title
            tvDescription.text = issue.description

            itemView.setOnClickListener {
                onClick(issue)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_topic, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(topics[position])
    }

    override fun getItemCount(): Int = topics.size

    fun updateData(newTopics: List<Issue>) {
        topics = newTopics
        notifyDataSetChanged()
    }
}

