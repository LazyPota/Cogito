package com.application.appgaruda.ui.fragment.home

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.application.appgaruda.R
import com.application.appgaruda.data.api.RetrofitClient
import com.application.appgaruda.data.repository.IssueRepository
import com.application.appgaruda.factory.HomeViewModelFactory
import com.application.appgaruda.helper.SessionManager
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeFragment : Fragment() {

    // 1️⃣ Inisialisasi ViewModel via Factory, injeksi IssueRepository
    private val viewModel: HomeViewModel by viewModels {
        val sessionManager = SessionManager(requireContext())
        val apiService = RetrofitClient.getApiService(sessionManager)
        val repository = IssueRepository(apiService)
        HomeViewModelFactory(repository)
    }

    private lateinit var btnStartDebate: Button
    private lateinit var tvUsernameHolder: TextView
    private lateinit var recyclerView: RecyclerView
    private lateinit var topicAdapter: IssueTopicAdapter
    private lateinit var  tv_isi_exp: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_home, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupView(view)
        setupRecyclerView()
        observeViewModel()
        handleListener()
        setupStatusBarStyle()
        // Mulai fetch setelah semuanya siap
        viewModel.fetchIssues()
        viewModel.fetchUserXp(SessionManager(requireContext()).getUsername().orEmpty())
    }

    private fun setupView(view: View) {
        btnStartDebate = view.findViewById(R.id.btn_start_debate)
        tvUsernameHolder = view.findViewById(R.id.tv_username_holder)
        recyclerView = view.findViewById(R.id.recyclerView)
        tvUsernameHolder.text = SessionManager(requireContext()).getUsername().orEmpty()
        tv_isi_exp = view.findViewById(R.id.tv_isi_exp)
    }

    private fun setupRecyclerView() {
        topicAdapter = IssueTopicAdapter(emptyList()) { topic ->
            requireActivity()
                .findViewById<BottomNavigationView>(R.id.bottomNavigationView)
                .selectedItemId = R.id.issuesFragment
        }
        recyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = topicAdapter
        }
    }

    private fun observeViewModel() {
        viewModel.issues.observe(viewLifecycleOwner) { topics ->
            topicAdapter.updateData(topics)
        }
        viewModel.error.observe(viewLifecycleOwner) { msg ->
            Toast.makeText(requireContext(), "Error: $msg", Toast.LENGTH_SHORT).show()
            Log.e("HomeFragment", "Error fetchIssues: $msg")
        }
        viewModel.userXp.observe(viewLifecycleOwner) { xp ->
            tv_isi_exp.text = "Total : ${xp}XP"
        }
    }

    private fun handleListener() {
        btnStartDebate.setOnClickListener {
            requireActivity()
                .findViewById<BottomNavigationView>(R.id.bottomNavigationView)
                .selectedItemId = R.id.issuesFragment
        }
    }

    private fun setupStatusBarStyle() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requireActivity().window.decorView.systemUiVisibility =
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        }
    }
}
