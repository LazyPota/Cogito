package com.application.appgaruda.ui.fragment.issues

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.IssueRepository
import com.application.appgaruda.helper.SessionManager
import com.application.appgaruda.ui.fragment.adapter.IssuesAdapter
import com.application.appgaruda.ui.viewmodel.IssuesViewModel
import com.application.appgaruda.ui.viewmodel.IssuesViewModelFactory

class IssuesFragment : Fragment() {

    private lateinit var viewModel: IssuesViewModel
    private lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_issues, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // 1️⃣ Inisialisasi RecyclerView
        recyclerView = view.findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())

        // 2️⃣ Setup ViewModel dengan Factory injeksi repository + API client
        val session = SessionManager(requireContext())
        val apiService = RetrofitClient.getApiService(session)
        val repository = IssueRepository(apiService)
        val factory = IssuesViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory)[IssuesViewModel::class.java]

        // 3️⃣ Observe LiveData topics & errors
        viewModel.topics.observe(viewLifecycleOwner) { list ->
            recyclerView.adapter = IssuesAdapter(
                topics = list,
                onProClick = { topic ->
                    findNavController().navigate(
                        R.id.action_issuesFragment_to_tmpChooseModeFragment,
                        Bundle().apply {
                            putString("topicId", topic.id.toString())
                            putString("description", topic.description)
                            putString("tittle", topic.title)
                        }
                    )
                }
            )
        }
        viewModel.error.observe(viewLifecycleOwner) { msg ->
            Toast.makeText(requireContext(), "Error: $msg", Toast.LENGTH_SHORT).show()
        }

        // 4️⃣ Fetch data dari server
        viewModel.fetchTopics()
    }
}
