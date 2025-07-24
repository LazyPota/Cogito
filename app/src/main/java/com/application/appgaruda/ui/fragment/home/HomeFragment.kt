package com.application.appgaruda.ui.fragment.home

import androidx.fragment.app.viewModels
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.helper.SessionManager
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeFragment : Fragment() {

    private val viewModel: HomeViewModel by viewModels()
    private lateinit var btnStarDebate: Button
    private lateinit var tvUsernameHolder: TextView
    private lateinit var recyclerView: RecyclerView
    private lateinit var topicAdapter: TopicAdapterHome

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        inisialisasi(view)
        handlelistener()
        observeTopPicks()
    }

    private fun observeTopPicks() {
        viewModel.topics.observe(viewLifecycleOwner) { topics ->
            topicAdapter = TopicAdapterHome(topics) { topic ->
                Toast.makeText(
                    requireContext(),
                    "ID: ${topic.id}, Judul: ${topic.title}",
                    Toast.LENGTH_SHORT
                ).show()
            }
            recyclerView.apply {
                layoutManager = LinearLayoutManager(requireContext())
                adapter = topicAdapter
            }
        }

        viewModel.fetchTopics()
    }

    private fun handlelistener() {
        btnStarDebate.setOnClickListener {
            val navView =
                requireActivity().findViewById<BottomNavigationView>(R.id.bottomNavigationView)
            navView.selectedItemId = R.id.issuesFragment
        }
    }


    private fun inisialisasi(view: View) {
        btnStarDebate = view.findViewById(R.id.btn_start_debate)
        tvUsernameHolder = view.findViewById(R.id.tv_username_holder)
        recyclerView = view.findViewById(R.id.recyclerView)
        val session = SessionManager(requireContext())
        tvUsernameHolder.text = session.getUsername().toString()
    }
}

